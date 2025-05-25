import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, School, Code, BookOpen, 
  Key, LogOut, Camera, Save, Loader2, AtSign,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import StudentLayout from '../students/StudentLayout';
import FacultyLayout from '../faculty/FacultyLayout';

const ProfilePage = () => {
  const navigate = useNavigate();
  const userID = JSON.parse(localStorage.getItem('user')).user.userID;
  const user = JSON.parse(localStorage.getItem('user')).user;
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    registrationNumber: '',
    // Student specific fields
    cgpa: '',
    semester: '',
    branch: '',
    // Faculty specific fields
    designation: '',
    department: '',
    specialization: '',
    // Social/Coding profiles
    githubUsername: '',
    leetcodeUsername: '',
    gfgUsername: '',
    codechefUsername: '',
    hackerrankUsername: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        
        let academicInfo = await axios.get(`/api/profile/getAcademicInfo/${userID}`);
        academicInfo = academicInfo.data.message;

        let personalInfo = await axios.get(`/api/profile/getPersonalInfo/${userID}`);
        personalInfo = personalInfo.data.message.details;

        let role = userID.toLowerCase().charAt(0) == 'f' ? 'faculty' : 'student';
        let data;
        if(role == 'student'){
          let codingProfiles = await axios.get(`/api/profile/getCodingProfiles/${userID}`);
          codingProfiles = codingProfiles.data.message.details;

          let cgpa = await axios.get(`/api/profile/getCGPA/${userID}`);
          cgpa = cgpa.data.message;
          data = {
            name: personalInfo.fullName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.address,
            bio: personalInfo.bio,
            registrationNumber: userID.toUpperCase(),
            cgpa: cgpa.currentCGPA,
            semester: academicInfo.currentSem,
            branch: academicInfo.branch,
            githubUsername: codingProfiles.github,
            leetcodeUsername: codingProfiles.leetcode,
            gfgUsername: codingProfiles.gfg,
            hackerrankUsername: codingProfiles.hackerrank,
            codechefUsername: codingProfiles.codechef
          }
        }
        else{
          data = {
            name: personalInfo.fullName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            address: personalInfo.address,
            bio: personalInfo.bio,
            registrationNumber: userID.toUpperCase(),
            designation: academicInfo.designation,
            department: academicInfo.department,
            specialization: academicInfo.specialization
          }
        }

        //let data = getMockProfileData('student')

        
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch profile data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      await axios.put('/api/profile/updateDetails',profileData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      setIsSaving(true);
      const data = {
        currentPassword : passwordData.currentPassword,
        newPassword : passwordData.newPassword,
        userID,
      }
      await axios.put('/api/profile/updatePassword',data);
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Layout based on user role
  const Layout = user?.role === 'faculty' ? FacultyLayout : StudentLayout;

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-200"></div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-48"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-32"></div>
            <div className="mt-6 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-64"></div>
              <div className="h-4 bg-gray-200 rounded w-56"></div>
              <div className="h-4 bg-gray-200 rounded w-72"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {/* Profile Header */}
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold relative">
                {profileData.name?.charAt(0) || 'U'}
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg">
                    <label htmlFor="avatar-upload" className="cursor-pointer">
                      <Camera className="h-6 w-6 text-gray-700" />
                      <input id="avatar-upload" type="file" className="hidden" />
                    </label>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900">{profileData.name}</h2>
                <p className="text-sm text-gray-500">
                  {user?.role === 'student' 
                    ? `Branch : ${profileData.branch}` 
                    : `${profileData.designation} - ${profileData.department}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {profileData.registrationNumber.toUpperCase()}
                </p>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="-ml-1 mr-2 h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    <User className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    <Mail className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    <Phone className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.phone || "Not provided"}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    <MapPin className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      name="address"
                      id="address"
                      rows="3"
                      value={profileData.address}
                      onChange={handleProfileChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    ></textarea>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.address || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    <User className="inline-block h-5 w-5 mr-2 text-gray-500" />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      id="bio"
                      rows="14"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      className="mt-1 pl-2 pr-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 border-2 border-stone-200 rounded-lg h-70 pl-2 pr-2">{profileData.bio || "No bio provided"}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                {user?.role === 'student' ? 'Academic Information' : 'Professional Information'}
              </h3>
              
              <div className="space-y-6">
                {user?.role === 'student' ? (
                  // Student specific fields
                  <>
                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                        <School className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Student ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.registrationNumber}</p>
                    </div>
                    
                    <div>
                      <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                        <BookOpen className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Branch
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.branch}</p>
                    </div>
                    
                    <div>
                      <label htmlFor="semester" className="block text-sm font-medium text-gray-700">
                        <BookOpen className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Current Semester
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.semester}</p>
                    </div>
                    
                    <div>
                      <label htmlFor="cgpa" className="block text-sm font-medium text-gray-700">
                        <BookOpen className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Current CGPA
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.cgpa}</p>
                    </div>
                  </>
                ) : (
                  // Faculty specific fields
                  <>
                    <div>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                        <School className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Faculty ID
                      </label>
                      <p className="mt-1 text-sm text-gray-900">{profileData.registrationNumber}</p>
                    </div>
                    
                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-gray-700">
                        <BookOpen className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Designation
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="designation"
                          id="designation"
                          value={profileData.designation}
                          onChange={handleProfileChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.designation}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                        <BookOpen className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Department
                      </label>
                      {isEditing ? (
                        <select
                          name="department"
                          id="department"
                          value={profileData.department}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="Computer Science">Computer Science</option>
                          <option value="Electronics">Electronics</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Civil">Civil</option>
                          <option value="Electrical">Electrical</option>
                        </select>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.department}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                        <BookOpen className="inline-block h-5 w-5 mr-2 text-gray-500" />
                        Specialization
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialization"
                          id="specialization"
                          value={profileData.specialization}
                          onChange={handleProfileChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{profileData.specialization}</p>
                      )}
                    </div>
                  </>
                )}

                {/* Coding Profiles (for students only) */}
                {user?.role === 'student' && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">Coding Profiles</h4>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="githubUsername" className="block text-sm font-medium text-gray-700">
                          <Code className="inline-block h-5 w-5 mr-2 text-gray-500" />
                          GitHub
                        </label>
                        {isEditing ? (
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              github.com/
                            </span>
                            <input
                              type="text"
                              name="githubUsername"
                              id="githubUsername"
                              value={profileData.githubUsername}
                              onChange={handleProfileChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                            />
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profileData.githubUsername ? (
                              <a 
                                href={`https://github.com/${profileData.githubUsername}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                github.com/{profileData.githubUsername}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="leetcodeUsername" className="block text-sm font-medium text-gray-700">
                          <Code className="inline-block h-5 w-5 mr-2 text-gray-500" />
                          LeetCode
                        </label>
                        {isEditing ? (
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              leetcode.com/
                            </span>
                            <input
                              type="text"
                              name="leetcodeUsername"
                              id="leetcodeUsername"
                              value={profileData.leetcodeUsername}
                              onChange={handleProfileChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                            />
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profileData.leetcodeUsername ? (
                              <a 
                                href={`https://leetcode.com/${profileData.leetcodeUsername}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                leetcode.com/{profileData.leetcodeUsername}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="gfgUsername" className="block text-sm font-medium text-gray-700">
                          <Code className="inline-block h-5 w-5 mr-2 text-gray-500" />
                          GeeksForGeeks
                        </label>
                        {isEditing ? (
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              auth.geeksforgeeks.org/user/
                            </span>
                            <input
                              type="text"
                              name="gfgUsername"
                              id="gfgUsername"
                              value={profileData.gfgUsername}
                              onChange={handleProfileChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                            />
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profileData.gfgUsername ? (
                              <a 
                                href={`https://auth.geeksforgeeks.org/user/${profileData.gfgUsername}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                auth.geeksforgeeks.org/user/{profileData.gfgUsername}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="codechefUsername" className="block text-sm font-medium text-gray-700">
                          <Code className="inline-block h-5 w-5 mr-2 text-gray-500" />
                          Codechef
                        </label>
                        {isEditing ? (
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              codechef.com/
                            </span>
                            <input
                              type="text"
                              name="codechefUsername"
                              id="codechefUsername"
                              value={profileData.codechefUsername}
                              onChange={handleProfileChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                            />
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profileData.codechefUsername ? (
                              <a 
                                href={`https://codechef.com/users/${profileData.codechefUsername}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                codechef.com/{profileData.codechefUsername}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="hackerrankUsername" className="block text-sm font-medium text-gray-700">
                          <Code className="inline-block h-5 w-5 mr-2 text-gray-500" />
                          Hackerrank
                        </label>
                        {isEditing ? (
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              hackerrank.com/
                            </span>
                            <input
                              type="text"
                              name="hackerrankUsername"
                              id="hackerrankUsername"
                              value={profileData.hackerrankUsername}
                              onChange={handleProfileChange}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                            />
                          </div>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            {profileData.hackerrankUsername ? (
                              <a 
                                href={`https://hackerrank.com/${profileData.hackerrankUsername}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                hackerrank.com/{profileData.hackerrankUsername}
                              </a>
                            ) : (
                              "Not provided"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="px-4 py-5 sm:p-6 border-t border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Account Settings</h3>
          
          <div className="space-y-4">
            <div>
              <button
                onClick={() => setIsChangingPassword(!isChangingPassword)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Key className="-ml-0.5 mr-2 h-4 w-4" />
                Change Password
              </button>
            </div>
            
            {isChangingPassword && (
              <div className="mt-4 sm:w-1/2">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      id="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            <div className="pt-2">
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="-ml-0.5 mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper functions for mock data
function getMockProfileData(role) {
  if (role === 'student') {
    return {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+91 9876543210',
      address: '123 College Road, Bangalore, Karnataka, India',
      bio: 'Computer Science student passionate about web development and artificial intelligence. Looking to build innovative solutions for real-world problems.',
      registrationNumber: 'S12345',
      cgpa: '8.76',
      semester: '5th Semester',
      branch: 'Computer Science',
      githubUsername: 'alexj',
      leetcodeUsername: 'alex_johnson',
      gfgUsername: 'alexjohnson',
    };
  } else { // faculty
    return {
      name: 'Dr. Sarah Williams',
      email: 'sarah.williams@example.com',
      phone: '+91 9876543211',
      address: '456 Faculty Housing, University Campus, Bangalore, Karnataka, India',
      bio: 'Associate Professor with 10+ years of experience in teaching and research. Specializing in artificial intelligence and machine learning algorithms.',
      registrationNumber: 'F54321',
      designation: 'Associate Professor',
      department: 'Computer Science',
      specialization: 'Artificial Intelligence & Machine Learning',
    };
  }
}

export default ProfilePage;