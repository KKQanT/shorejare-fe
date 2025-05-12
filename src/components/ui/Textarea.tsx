"use client"

import React, { forwardRef } from "react"

//Note: Hero ui behaving weird. So needed to create our own textarea.

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  className?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, className = "", ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        className={`w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-gray-100 placeholder-gray-500 resize-none focus:outline-none focus:ring-0 focus:border-gray-700 ${className}`}
        {...props}
      />
    )
  }
)

Textarea.displayName = "Textarea"

export default Textarea 