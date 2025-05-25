import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, BookOpen, X, Calendar, Filter } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import axios from 'axios';
import StudentLayout from '../students/StudentLayout';
import FacultyLayout from '../faculty/FacultyLayout';

const NotificationsPage = () => {
  const user = JSON.parse(localStorage.getItem('user')).user;
  const userID = user.userID;
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`/api/notifications/getNotifications/${userID}`);
        
        const data = response.data.message;
        
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-1">Stay updated with important announcements and updates</p>
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
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                filter === 'unread'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
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