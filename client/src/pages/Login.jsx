import React from 'react'
import Button from "../components/Button"
import InputField from "../components/InputField"
import logo1 from "../assets/logo1.png"

const Login = () => {
  return (
    <div class='w-full flex h-screen'>
        {/*Left Section*/}
        <div class='w-1/2 bg-gradient-to-br from-sky-100 via-sky-50 to-white flex justify-center items-center'>
            <img src={logo1} class='w-130 h-130'/>
        </div>

        {/*Right Section*/}
        <div class='w-1/2 flex justify-center items-center bg-white'>
            <form class=' w-[60%] h-[80%] p-10 rounded-4xl shadow-2xl text-center'>
                <h1 class='text-5xl font-semibold mt-15 mb-10'>Login</h1>
                <div className="text-left">
                  <InputField label='Email' type='text' placeholder='Email'/>
                  <InputField label='Password' type='password' placeholder='password'/>
                </div>
                <div className="flex flex-col lg:flex-row justify-around items-center mb-10 mt-15">
                    <Button type='submit' text='Submit'/>
                    <Button type='reset' text='Reset' />
                </div>
                <p className="mb-10 font-medium text-xl text-blue-600">Forgot password ?</p>
                <p>Don't have accout ? Contact Snehalatha csm-b 6677</p>
            </form>
        </div>
    </div>
  )
}

export default Login
