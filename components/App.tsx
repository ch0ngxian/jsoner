'use client'

import { useState, useEffect, useRef } from 'react'
import Coffee from './Coffee'
import VNode from './nodes/VNode'
import ErrorUnderline from './ErrorUnderline'
import CopyButton from './CopyButton'
import { parsePartialJson, ParseResult } from '@/utils/partialJsonParser'

interface ComponentData {
  input: string
  screen: {
    width: number
    height: number
  }
  parseResult: ParseResult
  dividerPosition: number
  isDividerHover: boolean
  textareaScrollTop: number
  showFormatTooltip: boolean
}

export default function App() {
  const [input, setInput] = useState(
    '{"str":"a", "obj":{"a": "1"}, "arr":[1,2,4], "bool": true, "empty": null}'
  )
  const [screen, setScreen] = useState({ width: 0, height: 0 })
  const [parseResult, setParseResult] = useState<ParseResult>({
    data: {},
    errors: [],
    isValid: true,
    fixesApplied: [],
  })
  const [dividerPosition, setDividerPosition] = useState(50)
  const [isDividerHover, setIsDividerHover] = useState(false)
  const [textareaScrollTop, setTextareaScrollTop] = useState(0)
  const [showFormatTooltip, setShowFormatTooltip] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const inputTextareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setParseResult(parsePartialJson(input))
  }, [input])

  useEffect(() => {
    const handleResize = () => {
      setScreen({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleDragging = (event: MouseEvent) => {
    const clientX = event.clientX
    const percentage = (clientX / window.outerWidth) * 100

    if (percentage >= 30 && percentage <= 70) {
      setDividerPosition(percentage)
    }
  }

  const startDragging = () => {
    setIsDragging(true)
  }

  const endDragging = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragging)
    } else {
      document.removeEventListener('mousemove', handleDragging)
    }

    return () => {
      document.removeEventListener('mousemove', handleDragging)
    }
  }, [isDragging])

  const handleTextareaScroll = (event: React.UIEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement
    setTextareaScrollTop(-target.scrollTop)
  }

  return (
    <div
      className="h-screen w-screen flex justify-center flex-col sm:flex-row"
      style={{ color: '#d4d4d4', fontSize: '0.75rem', fontWeight: 300 }}
      onMouseUp={endDragging}
    >
      <div
        className="input-panel-wrapper h-2/5 sm:h-screen relative"
        style={{
          backgroundColor: '#1e1e1e',
          width: screen.width > 640 ? `${dividerPosition}%` : '100%',
        }}
      >
        {/* Format Support Indicator */}
        <div
          className="format-indicator"
          onMouseEnter={() => setShowFormatTooltip(true)}
          onMouseLeave={() => setShowFormatTooltip(false)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="info-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="format-text">Formats</span>

          {/* Tooltip */}
          {showFormatTooltip && (
            <div className="format-tooltip">
              <div className="tooltip-title">Supported Formats:</div>
              <div className="tooltip-item">
                <span className="tooltip-bullet">•</span>
                <span>JSON</span>
              </div>
              <div className="tooltip-item">
                <span className="tooltip-bullet">•</span>
                <span>Ruby Hash ({'=>'}, :key)</span>
              </div>
            </div>
          )}
        </div>

        <textarea
          ref={inputTextareaRef}
          className="h-full w-full p-7 resize-none focus:outline-none overflow-y-scroll"
          style={{ backgroundColor: 'transparent', position: 'relative', zIndex: 1 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onScroll={handleTextareaScroll}
        />
        <ErrorUnderline
          errors={parseResult.errors}
          inputText={input}
          scrollTop={textareaScrollTop}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      </div>
      <div
        className="divider-outside flex justify-center"
        style={{
          left: `${dividerPosition}%`,
        }}
        onMouseDown={startDragging}
        onMouseEnter={() => setIsDividerHover(true)}
        onMouseLeave={() => setIsDividerHover(false)}
      >
        <div
          className="divider-inside"
          style={{
            backgroundColor: isDividerHover ? 'transparent' : '#444444',
          }}
        />
      </div>

      <div
        className="w-full sm:h-screen p-7 overflow-y-scroll flex-grow break-words relative"
        style={{
          width: screen.width > 640 ? `${100 - dividerPosition}%` : '100%',
        }}
      >
        <CopyButton jsonData={parseResult.data} className="absolute top-2 right-2" />
        <VNode node={parseResult.data} showEndComma={false} />
      </div>

      <Coffee />
    </div>
  )
}
