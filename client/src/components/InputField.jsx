import React from 'react'

const InputField = (props) => {
  return (
    <div className='mb-3'>
      <label class='text-md block mb-1'>
        {props.label}
      </label>
      <input type={props.type} placeholder={props.placeholder} 
      class='w-full text-md pl-2 pt-1 pb-1 rounded-lg border border-stone-500 focus:outline-none focus:ring-1 focus:ring-blue-400' >

      </input>
    </div>
  )
}

export default InputField;