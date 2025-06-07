import React, { useState, useEffect } from 'react';
import Button from "../components/Button";
import InputField from "../components/InputField";
import logo1 from "../assets/logo1.png";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useUser } from "../context/userContext";

const Login = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { setUser, user, loading } = useUser();
  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'faculty') {
        navigate('/faculty/profile');
      }
    }
  }, [user, loading]);
  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('/api/auth/login', { username, password });
    console.log(response);
    if (response.status === 200) {
      const me = await axios.get("/api/auth/me");
      setUser(me.data);

      if (me.data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/faculty/profile");
      }
    }
      
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      alert(error.response.data.message);
    } else {
      console.error('Error logging in:', error);
      alert('An unexpected error occurred.');
    }
  }
};
  return (
    <div className='w-full flex h-screen bg-gradient-to-br from-sky-100 via-white to-white'>
        {/*Left Section*/}
        <div className='w-1/2  flex justify-center items-center'>
            <img src={logo1} className='w-90 h-100'/>
        </div>

        {/*Right Section*/}
        <div className='w-1/2 flex justify-center items-center bg-white'>
            <form className=' w-[60%] h-[80%] p-10 rounded-3xl shadow-2xl text-center' onSubmit={handleLogin}>
                <h1 className='text-3xl font-semibold mt-6 mb-7'>Login</h1>
                <div className="text-left">
                  <InputField label='UserID' type='text' placeholder='userID' value={username} onChange={(e)=>setusername(e.target.value)} />
                  <InputField label='Password' type='password' placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} />
                </div>
                <div className="flex flex-col md:flex-row justify-around items-center mb-5 mt-7">
                    <Button type='submit' text='Submit'/>
                    <Button type='reset' text='Reset' onClick={() => {
                      setusername('');
                      setpassword('');
                    }}/>
                </div>

                <p className='text-sm'>Don't have account ? Contact <span className='text-blue-600 font-semibold'>Admin</span></p>
            </form>
        </div>
    </div>
  )
}

export default Login;
