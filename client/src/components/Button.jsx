import React from 'react'

const Button = (props) => {
  return (
    <div className='inline-block sm:w-auto w-full'>
      <button type={props.type} class='bg-gradient-to-r from-blue-700 to-blue-500 text-2xl text-white rounded-xl px-6 py-2 font-semibold hover:cursor-pointer w-full sm:w-auto'>
        {props.text}
      </button>
    </div>
  )
}

export default Button;
