'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Coffee() {
  const [isShow, setIsShow] = useState(false)

  const buyMeCoffee = () => {
    window.open('https://www.buymeacoffee.com/chongxian', '_blank')
  }

  return (
    <button
      className="fixed bottom-0 right-0"
      onMouseOver={() => setIsShow(true)}
      onMouseLeave={() => setIsShow(false)}
      onClick={buyMeCoffee}
    >
      <div
        className={`rounded-lg border border-gray-600 p-1.5 m-3 flex justify-end items-center transition-all duration-500 ease ${
          isShow ? 'w-52' : ''
        }`}
      >
        {isShow && <p className="mr-5">Buy me a coffee?</p>}
        <Image
          src={isShow ? '/coffee_hover.png' : '/coffee.png'}
          alt="Coffee"
          width={28}
          height={28}
          className="h-7 w-7"
        />
      </div>
    </button>
  )
}
