'use client'

import { JsonError } from '@/utils/partialJsonParser'

interface ErrorUnderlineProps {
  errors: JsonError[]
  inputText: string
  scrollTop: number
  style?: React.CSSProperties
  className?: string
}

interface UnderlineStyle {
  top: string
  left: string
  width: string
}

export default function ErrorUnderline({
  errors,
  inputText,
  scrollTop,
  style,
  className = '',
}: ErrorUnderlineProps) {
  const getUnderlineStyle = (error: JsonError): UnderlineStyle => {
    // Calculate position based on line and column
    const lineHeight = 18 // Approximate line height in pixels
    const charWidth = 7.2 // Approximate character width for monospace font
    const paddingTop = 28 // Textarea padding-top
    const paddingLeft = 28 // Textarea padding-left

    // Calculate top position (line number - 1 because line numbers start at 1)
    const top = paddingTop + (error.line - 1) * lineHeight + lineHeight - 2

    // Calculate left position
    const left = paddingLeft + (error.column - 1) * charWidth

    // Calculate underline width (span about 10 characters or to end of line)
    const lines = inputText.split('\n')
    const currentLine = lines[error.line - 1] || ''
    const remainingChars = currentLine.length - error.column + 1
    const underlineLength = Math.min(remainingChars, 20)
    const width = Math.max(underlineLength * charWidth, 10)

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${width}px`,
    }
  }

  return (
    <div className={`error-overlay-container ${className}`} style={style}>
      <div
        className="error-overlay"
        style={{
          top: `${scrollTop}px`,
        }}
      >
        {errors.map((error, index) => (
          <div
            key={index}
            className={`error-underline error-type-${error.type}`}
            style={getUnderlineStyle(error)}
            title={`Line ${error.line}, Col ${error.column}: ${error.message}`}
          />
        ))}
      </div>
    </div>
  )
}
