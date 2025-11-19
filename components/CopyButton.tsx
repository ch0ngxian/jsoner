'use client'

import { useState } from 'react'

interface CopyButtonProps {
  jsonData: any
  className?: string
}

export default function CopyButton({ jsonData, className = '' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2)
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const buttonStyle = copied
    ? {
        backgroundColor: '#2d5a2d',
        color: '#afcfa4',
        border: '1px solid #afcfa4',
      }
    : {
        backgroundColor: '#2d2d2d',
        color: '#d4d4d4',
        border: '1px solid #555',
        cursor: 'pointer',
      }

  return (
    <button
      onClick={copyToClipboard}
      className={`px-3 py-1.5 rounded transition-all duration-200 font-mono text-sm hover:!bg-[#3d3d3d] ${className}`}
      style={buttonStyle}
      title="Copy formatted JSON"
    >
      {copied ? 'Copied!' : 'Copy JSON'}
    </button>
  )
}
