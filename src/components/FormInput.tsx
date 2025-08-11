import React from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  endIcon?: React.ReactNode
}

const FormInput: React.FC<FormInputProps> = ({ icon, endIcon, ...props }) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl py-3 ${
          icon ? 'pl-11' : 'pl-4'
        } ${endIcon ? 'pr-11' : 'pr-4'} text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300`}
      />
      {endIcon && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {endIcon}
        </div>
      )}
    </div>
  )
}

export default FormInput
