"use client"
import React from 'react'
import { useState } from 'react'
import Questions from '@/components/Questionaire/questions'

const QuizDashboard = () => {
  const [mode, setMode] = useState<string | null>(null)

  if (!mode) {
    return (
      <div className='m-auto -mt-28'>
      <div className='flex min-h-dvh items-center justify-center p-2'>
        <div className='text-center max-w-4xl w-full'>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-3xl md:text-4xl font-bold text-center mb-8'>
              <h1>Choose a Quiz Mode</h1>
            </div>
            <div className='flex flex-row items-center justify-center'>
              <div className='flex gap-6 flex-wrap items-center justify-center'>
                {
                  ['Random 25', 'Full Burst'].map((modeOption: string) => {
                    return (
                      <button
                        key={modeOption}
                        onClick={() => setMode(modeOption)}
                        className={`
                          relative overflow-hidden
                          backdrop-blur-sm rounded-lg p-8 border bg-white/10 border-white/20
                          transition-all duration-300 ease-in-out transform
                          hover:scale-105 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/15
                          active:scale-95 cursor-pointer
                          text-lg font-medium min-w-[200px]
                        `}
                      >
                        <div className="text-2xl font-bold mb-2">{modeOption}</div>
                        <div className="text-sm text-gray-600">
                          {modeOption === 'Random 25'
                            ? 'Answer 10 random questions'
                            : 'Answer all available questions'
                          }
                        </div>
                      </button>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    )
  }

  if (mode === 'Random 25') {
    return (
      <div className='m-auto w-full px-3'>
        <Questions setMode={setMode} quizMode="random10" maxQuestions={25} />
      </div>
    )
  }

  if (mode === 'Full Burst') {
    return (
      <div className='m-auto'>
        <Questions setMode={setMode} quizMode="fullburst" />
      </div>
    )
  }

}

export default QuizDashboard