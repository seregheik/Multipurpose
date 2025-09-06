"use client"
import { useAppProvider } from '@/Context/basicProvider'
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { PiBrainThin } from "react-icons/pi";
import { MdRefresh } from "react-icons/md";

const Questions = () => {
  const { data, isLoading, error, handleGetData } = useAppProvider();
  const number = useRef(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const getData = async () => {
    setIsTransitioning(true);

    // Delay the API call to allow fade out animation
    setTimeout(async () => {
      await handleGetData({ question_number: number.current++ });
      setSelectedOption(null);
      setShowResult(false);

      // Allow fade in animation after data update
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleRestart = () => {
    setIsTransitioning(true);

    // Reset question counter and state
    setTimeout(async () => {
      number.current = 10;
      await handleGetData({ question_number: number.current++ });
      setSelectedOption(null);
      setShowResult(false);

      // Allow fade in animation after data update
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleOptionSelect = (index: number) => {
    if (isTransitioning) return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    setShowResult(true);
    // You can add logic here to check if answer is correct

    // Auto-advance to next question after showing result
    setTimeout(() => {
      getData();
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
          <div className="text-xl font-medium">Loading question...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-24">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <div className="text-xl font-medium text-red-600">Something went wrong</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main>
      <div className="flex min-h-dvh items-center justify-center p-24">
        <div className="text-center max-w-4xl w-full">
          {/* Question Header with Brain Icon and Restart Button */}
          <div className={`mb-8 transition-all duration-300 ease-in-out transform ${isTransitioning
            ? 'opacity-0 translate-y-4 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
            }`}>
            <div className="flex items-center justify-center mb-6 relative">
              <PiBrainThin className="text-6xl text-gray-600 mr-4" />
              <div className="text-lg font-medium text-gray-500">
                Question {number.current - 1}
              </div>

              {/* Restart Button */}
              <button
                onClick={handleRestart}
                disabled={isTransitioning}
                className={`
                  absolute right-0 top-1/2 transform -translate-y-1/2
                  bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/20
                  transition-all duration-200 ease-in-out
                  hover:scale-110 hover:bg-white/20 hover:shadow-lg
                  active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                  ${isTransitioning ? 'animate-pulse' : ''}
                `}
                title="Restart Quiz"
              >
                <MdRefresh className={`
                  text-2xl text-gray-600 transition-transform duration-300 ease-in-out
                  ${isTransitioning ? 'animate-spin' : 'hover:rotate-180'}
                `} />
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className={`text-3xl md:text-4xl font-bold text-center pb-8 transition-all duration-300 ease-in-out transform ${isTransitioning
            ? 'opacity-0 translate-y-4 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
            }`}>
            {data?.question}
          </div>

          {/* Options Container */}
          <div className={`min-h-[300px] flex flex-col items-center justify-center mb-8 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {data?.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleOptionSelect(index)}
                  disabled={isTransitioning || showResult}
                  className={`
                    relative overflow-hidden
                    bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20
                    transition-all duration-300 ease-in-out transform
                    hover:scale-105 hover:-translate-y-1 hover:shadow-2xl
                    active:scale-95
                    disabled:cursor-not-allowed
                    ${selectedOption === index
                      ? 'bg-gray-600/20 border-gray-500 scale-105 shadow-2xl'
                      : 'hover:bg-white/15'
                    }
                    ${showResult && selectedOption === index
                      ? 'bg-green-500/20 border-green-400'
                      : ''
                    }
                    ${isTransitioning ? 'animate-pulse' : ''}
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isTransitioning ? 'pulse 1s infinite' : `slideInUp 0.5s ease-out ${index * 100}ms both`
                  }}
                >
                  {/* Option Letter Badge */}
                  <div className={`
                    absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center
                    text-sm font-bold transition-all duration-300
                    ${selectedOption === index
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {String.fromCharCode(65 + index)}
                  </div>

                  {/* Option Text */}
                  <div className="text-left pl-12 pr-4 text-lg font-medium">
                    {option}
                  </div>

                  {/* Selection Indicator */}
                  {selectedOption === index && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}

                  {/* Result Indicator */}
                  {showResult && selectedOption === index && (
                    <div className="absolute top-3 right-3">
                      <div className="text-green-500 text-xl animate-bounce">✓</div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Result Message */}
            {showResult && (
              <div className={`mt-6 transition-all duration-500 ease-in-out transform ${showResult ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}>
                <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-400/20">
                  <div className="text-green-600 font-medium">Great choice! Moving to next question...</div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Previous Question Button */}
            <button
              onClick={() => {/* Add previous question logic */ }}
              disabled={isTransitioning || number.current <= 2}
              className={`
                bg-white rounded-full border border-gray-200 cursor-pointer p-3 
                shadow-lg hover:shadow-2xl active:shadow-md
                transform transition-all duration-200 ease-in-out
                hover:scale-110 hover:-translate-y-1 active:scale-95
                disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none
                ${isTransitioning ? 'animate-pulse' : ''}
                ${number.current <= 2 ? 'pointer-events-none' : ''}
              `}
              title="Previous Question"
            >
              <IoIosArrowBack className="text-4xl transition-transform duration-200 ease-in-out" />
            </button>

            {/* Next Question Button */}
            <button
              onClick={handleNext}
              disabled={isTransitioning || selectedOption === null || showResult}
              className={`
                rounded-full border border-gray-200 cursor-pointer p-3 
                shadow-lg hover:shadow-2xl active:shadow-md
                transform transition-all duration-200 ease-in-out
                hover:scale-110 hover:-translate-y-1 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                ${isTransitioning ? 'animate-pulse' : ''}
                ${selectedOption !== null && !showResult
                  ? 'bg-gray-600 border-gray-600 hover:bg-gray-700'
                  : 'bg-white'
                }
              `}
              title={selectedOption !== null ? "Next Question" : "Select an answer first"}
            >
              <IoIosArrowForward className={`
                ${selectedOption !== null && !showResult ? 'text-white' : 'text-black'} 
                text-4xl transition-transform duration-200 ease-in-out
                ${isTransitioning ? 'rotate-90' : 'group-hover:translate-x-1'}
              `} />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="text-sm text-gray-500 mb-2">Question Progress</div>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((number.current - 1) / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 30px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </main>
  );
};

export default Questions