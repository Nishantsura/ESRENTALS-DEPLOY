'use client'

import { Banknote} from 'lucide-react'
import Image from 'next/image'

interface CarRatingProps {
  rating: number
}

export function CarRating({ rating }: CarRatingProps) {
  return (
    <div className="flex flex-row items-center gap-4 mb-6 rounded-xl py-4 bg-zinc-800/80 border border-zinc-700/50 shadow-lg">
      <div className="flex flex-row gap-3 items-center px-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 512 512"><path fill="rgb(45, 212, 191)" d="m252.5 381l-128 49c-5.9 2.2-12.1-2.3-11.8-8.6l7-136.9c.1-2.1-.6-4.2-1.9-5.9L31.6 172c-4-4.9-1.6-12.2 4.5-13.9l132.4-35.6c2.1-.6 3.9-1.9 5-3.7L248.3 4c3.4-5.3 11.2-5.3 14.6 0l74.8 114.9c1.2 1.8 3 3.1 5 3.7l132.4 35.6c6.1 1.6 8.5 9 4.5 13.9l-86.1 106.6c-1.3 1.7-2 3.8-1.9 5.9l7 136.9c.3 6.3-5.9 10.8-11.8 8.6l-128-49c-2.1-.8-4.3-.8-6.3-.1"/><path fill="rgba(45, 212, 191, 0.5)" d="m456.1 51.7l-41-41c-1.2-1.2-2.8-1.7-4.4-1.5s-3.1 1.2-3.9 2.6l-42.3 83.3c-1.2 2.1-.8 4.6.9 6.3c1 1 2.4 1.5 3.7 1.5c.9 0 1.8-.2 2.6-.7L454.9 60c1.4-.8 2.4-2.2 2.6-3.9c.3-1.6-.3-3.2-1.4-4.4m-307 43.5l-42.3-83.3c-.8-1.4-2.2-2.4-3.9-2.6c-1.6-.2-3.3.3-4.4 1.5l-41 41c-1.2 1.2-1.7 2.8-1.5 4.4s1.2 3.1 2.6 3.9l83.3 42.3c.8.5 1.7.7 2.6.7c1.4 0 2.7-.5 3.7-1.5c1.7-1.8 2-4.4.9-6.4m140.7 410l-29-88.8c-.2-.9-.7-1.7-1.3-2.3c-1-1-2.3-1.5-3.7-1.5c-2.4 0-4.4 1.6-5.1 3.9l-29 88.8c-.4 1.6-.1 3.3.9 4.6s2.5 2.1 4.2 2.1h57.9c1.6 0 3.2-.8 4.2-2.1c1.1-1.4 1.4-3.1.9-4.7"/></svg>
        <p className="text-2xl font-bold text-white">{rating ?? 'N/A'}<span className="text-teal-400 text-sm ml-1">/5</span></p>
      </div>
      <div className='w-[1px] h-14 rounded-md bg-zinc-600/50'></div>
      <div className="flex flex-row gap-4 items-center px-5">
        <div className="p-2.5 rounded-full bg-teal-500/20">
          <Banknote className="w-8 h-8 text-teal-400" />
        </div>
        <p className="text-base font-semibold text-white leading-5">
          No advance fee
          <br/>
          <span className="text-sm font-medium text-zinc-400">Super fast verification</span>
        </p>
      </div>
    </div>
  )
}
