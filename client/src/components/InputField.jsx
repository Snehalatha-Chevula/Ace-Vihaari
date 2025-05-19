import React from 'react'

const InputField = (props) => {
  return (
    <div className='mb-6'>
      <label class='text-2xl block text-gray-600 mb-2'>
        {props.label}
      </label>
      <input type={props.type} placeholder={props.placeholder} 
      class='w-full text-xl pl-3 pt-2 pb-2 rounded-xl border border-stone-400 focus:outline-none focus:ring-2 focus:ring-blue-400' >

      </input>
    </div>
  )
}

export default InputField;