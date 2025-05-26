import React, { useState } from 'react';
import Button from "../components/Button";
import InputField from "../components/InputField";
import logo1 from "../assets/logo1.png";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-hot-toast';


const Login = () => {
  const navigate = useNavigate();
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('/api/auth/login', { username, password });

    const data = response.data;

    if (response.status === 200) {
      localStorage.removeItem('userName');
      console.log('Login successful:');
      localStorage.setItem('user', JSON.stringify(data));
      if (data.user.role === 'student') {
        navigate(`/student/dashboard`);
      } else if (data.user.role === 'faculty') {
        navigate(`/faculty/profile`);
      }
    } else {
      alert(data.message);
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
                <h1 className='text-3xl font-semibold mt-3 mb-7'>Login</h1>
                <div className="text-left">
                  <InputField label='Email' type='text' placeholder='Email' value={username} onChange={(e)=>setusername(e.target.value)} />
                  <InputField label='Password' type='password' placeholder='password' value={password} onChange={(e)=>setpassword(e.target.value)} />
                </div>
                <div className="flex flex-col md:flex-row justify-around items-center mb-5 mt-7">
                    <Button type='submit' text='Submit'/>
                    <Button type='reset' text='Reset' onClick={() => {
                      setusername('');
                      setpassword('');
                    }}/>
                </div>
                <p className="mb-8 font-medium text-md text-blue-600">Forgot password ?</p>
                <p className='text-sm'>Don't have account ? Contact <span className='text-blue-600 font-semibold'>Admin</span></p>
            </form>
        </div>
    </div>
  )
}

export default Login;
