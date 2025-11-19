'use client'

import { useState, useEffect } from 'react'
import Field from './Field'
import OpenButton from './OpenButton'
import CloseButton from './CloseButton'
import VNode from './VNode'

interface VObjectProps {
  field?: string | number
  object: Record<string, any>
  showEndComma?: boolean
}

export default function VObject({ field, object, showEndComma = true }: VObjectProps) {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    setIsOpen(Object.keys(object).length > 0)
  }, [object])

  const objectKeys = Object.keys(object)

  return (
    <div className="w-full">
      <div className={isOpen ? 'hidden' : ''}>
        <div className="flex">
          {field && (
            <>
              <Field field={field} />
              <p className="pr-1">:</p>
            </>
          )}
          {'{'}
          {objectKeys.length > 0 && <OpenButton onClick={() => setIsOpen(true)} />}
          {'}'}
          {showEndComma && <span>,</span>}
        </div>
      </div>
      <div className={`${!isOpen ? 'hidden' : ''} w-full`}>
        <div className="flex items-center">
          {field && (
            <>
              <Field field={field} />
              <p className="pr-1">:</p>
            </>
          )}
          {'{'}
          {isOpen && <CloseButton onClick={() => setIsOpen(false)} />}
        </div>
        {objectKeys.map((key, index) => (
          <div key={index} className="flex w-full">
            <VNode
              className="ml-8 w-full"
              showEndComma={index + 1 !== objectKeys.length}
              field={key}
              node={object[key]}
            />
          </div>
        ))}
        {'}'}{showEndComma && <span>,</span>}
      </div>
    </div>
  )
}
