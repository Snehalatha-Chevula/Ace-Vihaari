import React from 'react'

const Button = (props) => {
  return (
    <div className='inline-block sm:w-auto w-full'>
      <button type={props.type} onClick={props.onClick} className='bg-gradient-to-r from-blue-700 to-blue-500 text-md text-white rounded-xl px-5 py-1 font-semibold hover:cursor-pointer w-full sm:w-auto'>
        {props.text}
      </button>
    </div>
  )
}

export default Button;
