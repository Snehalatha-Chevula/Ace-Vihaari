import React, { useState, useEffect, use } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, BookOpen, X, Calendar, Filter, Send, Plus } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import StudentLayout from '../students/StudentLayout';
import FacultyLayout from '../faculty/FacultyLayout';
import { toast } from 'react-hot-toast';

const NotificationsPage = () => {
  const user = JSON.parse(localStorage.getItem('user')).user;
  const userID = user.userID;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    targetAudience: {
      branch: [],
      semester: [],
      section: []
    },
    action : '',
    actionLink : ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTargetChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      targetAudience: {
        ...prev.targetAudience,
        [name]: checked 
          ? [...prev.targetAudience[name], value]
          : prev.targetAudience[name].filter(item => item !== value)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
       let userName = await axios.post('/api/dashboard/getUserName',{userID});
       userName = userName.data.message.fullName;
       const details = {formData,userID,userName};
       const res = await axios.post('/api/notifications/createNotifications',details);
       toast.success("Notification sent successfully");
       setUploadModalOpen(false);

       const response = await axios.get(`/api/notifications/getNotifications/${userID}`);
       let data = response.data.message;
        if(user.role == 'faculty'){
          for(let i=0;i<data.length;i++) {
            data[i]['isRead'] = true;
          }
        }
       setNotifications(data);
    }
    catch(e){
      console.log("error in api request",e);
    }
  };

  const branches = ['ALL','CSE','IT','IOT','CSM','CSD','ECE','EEE','CIVIL','MECH'];
  const semesters = ['ALL','1', '2', '3', '4', '5', '6', '7', '8'];
  const sections = ['ALL','A', 'B', 'C'];

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`/api/notifications/getNotifications/${userID}`);
        
        let data = response.data.message;
        if(user.role == 'faculty'){
          for(let i=0;i<data.length;i++) {
            data[i]['isRead'] = true;
          }
        }
        
        setNotifications(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setError('Failed to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      // In a real app, you would use:
      await axios.put(`/api/notifications/markNotificationAsRead`,{userID, notificationId});
      
      // Update UI optimistically
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true } 
            : notification
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // In a real app, you would make an API call
      await axios.put('/api/notifications/markAllNotificationsAsRead',{userID});
      // Update UI optimistically
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Filter notifications
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread'
      ? notifications.filter(notification => !notification.isRead)
      : notifications.filter(notification => notification.type === filter);

  // Group notifications by date
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedNotifications).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  // Layout based on user role
  const Layout = user?.role === 'faculty' ? FacultyLayout : StudentLayout;

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with important announcements and updates</p>
        </div>
        {user?.role === 'faculty' && (
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              Create Notification
            </button>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {(user.role == 'student' && <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  filter === 'unread'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>)
            }
            <button
              onClick={() => setFilter('info')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === 'info'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Info
            </button>
            <button
              onClick={() => setFilter('success')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === 'success'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Success
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === 'warning'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Warning
            </button>
          </div>
          
          {notifications.some(notification => !notification.isRead) && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow overflow-y-auto overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse flex flex-col items-center justify-center">
              <div className="rounded-full bg-gray-200 h-16 w-16 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2.5"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mt-2"></div>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <svg className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-xl font-medium text-gray-900">Failed to load notifications</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <button 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">No notifications</h2>
            <p className="mt-2 text-gray-600">
              {filter === 'all' 
                ? 'You have no notifications at the moment' 
                : filter === 'unread'
                  ? 'You have no unread notifications'
                  : `You have no ${filter} notifications`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sortedDates.map((date) => (
              <div key={date} className="divide-y divide-gray-100">
                <div className="px-4 py-2 bg-gray-50">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <h3 className="text-sm font-medium text-gray-600">
                      {formatDate(date)}
                    </h3>
                  </div>
                </div>
                {groupedNotifications[date].map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex">
                      <div className={`flex-shrink-0 ${getNotificationTypeClasses(notification.type).bg} rounded-full p-2`}>
                        {getNotificationTypeIcon(notification.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className=" bg-white rounded-lg p-0 hover:bg-gray-100"
                              >
                              <span className="p-1 text-xs text-green-900">Mark as read</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                        <div className="mt-2 text-xs text-gray-500 flex items-center flex-wrap gap-2">
                          <span>
                            {formatNotificationTime(notification.timestamp)}
                          </span>
                          {notification.sender && (
                            <>
                              <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mx-1"></span>
                              <span>
                                From: {notification.sender}
                              </span>
                            </>
                          )}
                          {notification.action && (
                            <>
                              <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mx-1"></span>
                              <a href={notification.actionLink} className="text-blue-600 hover:text-blue-700 font-medium">
                                {notification.action}
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {uploadModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity pointer-events-none" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-1"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Create Notification</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Send notifications to specific groups of students
                    </p>

                    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                      {/* Basic Information */}
                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Title <span className="text-error-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              id="title"
                              value={formData.title}
                              onChange={handleChange}
                              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Enter notification title"
                              required
                            />
                          </div>
            
                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                              Message <span className="text-error-500">*</span>
                            </label>
                            <textarea
                              id="message"
                              name="message"
                              rows="4"
                              value={formData.message}
                              onChange={handleChange}
                              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Enter notification message"
                              required
                            ></textarea>
                          </div>
            
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                              Notification Type
                            </label>
                            <select
                              id="type"
                              name="type"
                              value={formData.type}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            >
                              <option value="info">Information</option>
                              <option value="success">Success</option>
                              <option value="warning">Warning</option>
                              <option value="error">Error</option>
                            </select>
                          </div>
                        </div>
                      </div>
            
                      {/* Target Audience */}
                      <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Target Audience</h3>
                        
                        {/* Branches */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Branches
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {branches.map(branch => (
                              <label key={branch} className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  name="branch"
                                  value={branch}
                                  checked={formData.targetAudience.branch.includes(branch)}
                                  onChange={handleTargetChange}
                                  className="p-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{branch}</span>
                              </label>
                            ))}
                          </div>
                        </div>
            
                        {/* Semesters */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Semesters
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {semesters.map(semester => (
                              <label key={semester} className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  name="semester"
                                  value={semester}
                                  checked={formData.targetAudience.semester.includes(semester)}
                                  onChange={handleTargetChange}
                                  className="p-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{semester} Semester</span>
                              </label>
                            ))}
                          </div>
                        </div>
            
                        {/* Sections */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Sections
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {sections.map(section => (
                              <label key={section} className="inline-flex items-center">
                                <input
                                  type="checkbox"
                                  name="section"
                                  value={section}
                                  checked={formData.targetAudience.section.includes(section)}
                                  onChange={handleTargetChange}
                                  className="p-2 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">Section {section}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                      </div>

                      <div className="px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                              Action Label 
                            </label>
                            <input
                              type="text"
                              name="action"
                              id="action"
                              value={formData.action}
                              onChange={handleChange}
                              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Enter action"
                            />
                          </div>
            
                          <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                              Action Link
                            </label>
                            <textarea
                              id="actionLink"
                              name="actionLink"
                              rows="4"
                              value={formData.actionLink}
                              onChange={handleChange}
                              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              placeholder="Enter actionLink"
                            ></textarea>
                          </div>
                        </div>
                      </div>
            
                      {/* Preview */}
                      <div className="px-4 py-5 sm:p-6 bg-gray-50">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Preview</h3>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start">
                            <div className={`flex-shrink-0 rounded-full p-2 ${
                              formData.type === 'success' ? 'bg-success-100 text-success-600' :
                              formData.type === 'warning' ? 'bg-warning-100 text-warning-600' :
                              formData.type === 'error' ? 'bg-error-100 text-error-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <Bell className="h-5 w-5" />
                            </div>
                            
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-900">{formData.title || 'Notification Title'}</p>
                              <p className="mt-1 text-sm text-gray-500">{formData.message || 'Notification message will appear here'}</p>
                              <div className="mt-2 text-xs text-gray-500">
                                Target: {[
                                  formData.targetAudience.branch.length ? `${formData.targetAudience.branch.join(', ')} branch(es)` : null,
                                  formData.targetAudience.semester.length ? `${formData.targetAudience.semester.join(', ')} semester(s)` : null,
                                  formData.targetAudience.section.length ? `Section ${formData.targetAudience.section.join(', ')}` : null
                                ].filter(Boolean).join(' • ') || 'All Students'}
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                {formData.action || 'Action'} : {formData.actionLink || 'Action Link'}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
            
                      {/* Actions */}
                      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                        <button
                          type="button"
                          onClick={() => setUploadModalOpen(false)}
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mr-3"
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <Send className="h-4 w-4 mr-1.5" />
                          {isSubmitting ? 'Sending...' : 'Send Notification'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>   
      )}

    </Layout>
  );
};

// Helper functions for mock data

// Helper functions for notification display
function getNotificationTypeClasses(type) {
  switch (type) {
    case 'success':
      return { bg: 'bg-green-100', text: 'text-green-600', icon: <CheckCircle className="h-5 w-5 text-green-600" /> };
    case 'warning':
      return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: <AlertCircle className="h-5 w-5 text-yellow-600" /> };
    case 'error':
      return { bg: 'bg-error-100', text: 'text-error-600', icon: <X className="h-5 w-5 text-error-600" /> };
    case 'info':
    default:
      return { bg: 'bg-blue-100', text: 'text-blue-600', icon: <Info className="h-5 w-5 text-blue-600" /> };
  }
}

function getNotificationTypeIcon(type) {
  return getNotificationTypeClasses(type).icon;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateString === today) {
    return 'Today';
  } else if (dateString === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return format(date, 'MMMM d, yyyy');
  }
}

function formatNotificationTime(timestamp) {
  const date = new Date(timestamp);
  
  // If less than 24 hours ago, show relative time
  if (Date.now() - date.getTime() < 1000 * 60 * 60 * 24) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  // Otherwise show actual time
  return format(date, 'MMM d, yyyy \'at\' h:mm a');
}

export default NotificationsPage;