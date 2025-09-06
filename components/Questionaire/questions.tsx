"use client"
import { useAppProvider } from '@/Context/basicProvider'
import { useRef } from 'react';
import { useEffect } from 'react';

const Questions = () => {
  const { data, isLoading, error, handleGetData } = useAppProvider();
  const number = useRef(1)

  if (isLoading) {
    return <div>loading...</div>
  }

  if (error) {
    return <div>error</div>
  }
const getData = async () => {
  await handleGetData({ question_number: number.current++ })
}

  console.log(data)

  return (
    <div className=''>
      <div className='text-2xl font-bold'>{data?.question}</div>
      <button onClick={getData}>get</button>
      <div>
        {data?.options?.map((item: string , index: number) => (
          console.log(item),
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  )
}

export default Questions