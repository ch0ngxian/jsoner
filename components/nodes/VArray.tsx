'use client'

import { useState, useEffect } from 'react'
import Field from './Field'
import OpenButton from './OpenButton'
import CloseButton from './CloseButton'
import VNode from './VNode'

interface VArrayProps {
  field?: string | number
  array: any[]
  showEndComma?: boolean
}

export default function VArray({ field, array, showEndComma = true }: VArrayProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setIsOpen(array.length > 0)
  }, [array])

  return (
    <div>
      <div className={isOpen ? 'hidden' : ''}>
        <div className="flex">
          {field && (
            <>
              <Field field={field} />
              <p className="pr-1">:</p>
            </>
          )}
          [
          {array.length > 0 && (
            <OpenButton onClick={() => setIsOpen(true)} count={array.length} />
          )}
          ]
          {showEndComma && <span>,</span>}
        </div>
      </div>
      <div className={!isOpen ? 'hidden' : ''}>
        <div className="flex items-center">
          {field && (
            <>
              <Field field={field} />
              <p className="pr-1">:</p>
            </>
          )}
          [
          {isOpen && <CloseButton onClick={() => setIsOpen(false)} />}
        </div>
        {array.map((node, index) => (
          <div key={index} className="flex">
            <VNode
              className="ml-8"
              showEndComma={index + 1 !== array.length}
              node={node}
            />
          </div>
        ))}
        ]{showEndComma && <span>,</span>}
      </div>
    </div>
  )
}
