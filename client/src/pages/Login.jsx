import React from 'react'
import Button from "../components/Button"
import InputField from "../components/InputField"
import logo1 from "../assets/logo1.png"

const Login = () => {
  return (
    <div class='w-full flex h-screen bg-gradient-to-br from-sky-100 via-white to-white'>
        {/*Left Section*/}
        <div class='w-1/2  flex justify-center items-center'>
            <img src={logo1} class='w-90 h-100'/>
        </div>

        {/*Right Section*/}
        <div class='w-1/2 flex justify-center items-center bg-white'>
            <form class=' w-[60%] h-[80%] p-10 rounded-3xl shadow-2xl text-center'>
                <h1 class='text-3xl font-semibold mt-3 mb-7'>Login</h1>
                <div className="text-left">
                  <InputField label='Email' type='text' placeholder='Email'/>
                  <InputField label='Password' type='password' placeholder='password'/>
                </div>
                <div className="flex flex-col md:flex-row justify-around items-center mb-5 mt-7">
                    <Button type='submit' text='Submit'/>
                    <Button type='reset' text='Reset' />
                </div>
                <p className="mb-8 font-medium text-md text-blue-600">Forgot password ?</p>
                <p className='text-sm'>Don't have account ? Contact <span className='text-blue-600 font-semibold'>Admin</span></p>
            </form>
        </div>
    </div>
  )
}

export default Login
