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

  return (
    <button
      onClick={copyToClipboard}
      className={`rounded-lg border p-1.5 transition-all duration-500 ease text-sm ${
        copied
          ? 'border-green-400 bg-green-900 text-green-200'
          : 'border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800'
      } ${className}`}
      title="Copy formatted JSON"
    >
      {copied ? 'Copied!' : 'Copy JSON'}
    </button>
  )
}
