"use client"

//Note: Hero UI wont work as expected, that's why we are using this custom component

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  key: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
}

export default function Select({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select option", 
  className = "" 
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)
  
  const selectedOption = options.find(option => option.key === value)

  const toggleDropdown = () => setIsOpen(!isOpen)
  
  const handleSelect = (key: string) => {
    onChange(key)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div 
      ref={selectRef}
      className={`relative ${className}`}
    >
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full flex items-center justify-between rounded px-3 py-2 bg-gray-800 border border-gray-700 text-sm text-gray-200"
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown 
          className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md bg-gray-800 border border-gray-700 shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <li 
                key={option.key}
                onClick={() => handleSelect(option.key)}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 
                  ${option.key === value ? 'bg-gray-700 text-white' : 'text-gray-200'}`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
} 