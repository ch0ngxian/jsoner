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
      className={`rounded-lg p-1.5 text-sm ${
        copied
          ? 'copy-btn-success'
          : 'copy-btn'
      } ${className}`}
      title="Copy formatted JSON"
    >
      {copied ? 'Copied!' : 'Copy JSON'}
    </button>
  )
}
