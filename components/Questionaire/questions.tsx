"use client"
import { useAppProvider } from '@/Context/basicProvider'
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { PiBooksThin, PiBrainThin, PiHandsClapping } from "react-icons/pi";
import { MdRefresh } from "react-icons/md";
import { IoTrophyOutline } from "react-icons/io5";
import { GiPartyPopper } from 'react-icons/gi';
import { LuBicepsFlexed } from 'react-icons/lu';

interface QuestionsProps {
  setMode: (mode: string | null) => void;
  quizMode?: 'random10' | 'fullburst';
  maxQuestions?: number;
}

const Questions = ({ setMode, quizMode = 'fullburst', maxQuestions }: QuestionsProps) => {
  const { data, isLoading, error, handleGetData, isInitialLoading } = useAppProvider();
  const number = useRef(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [userName, setUsername] = useState("")
  const [name, setName] = useState(userName)

  // Track requested question numbers to avoid repeats
  const questionNumberRequested = useRef<number[]>([])

  useEffect(() => {
    const storedName = localStorage.getItem("QizzAppName")
    if (storedName) {
      setName(storedName)
    } else {
      setName("Wondering User")
    }
  }, [])

  // Score tracking state
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);

  // Calculate effective max questions based on mode
  const effectiveMaxQuestions = quizMode === 'random10'
    ? (maxQuestions || 10)
    : (data?.total_questions || 0);

  // Function to get a random question number that hasn't been requested
  const getRandomQuestionNumber = (totalQuestions: number): number => {
    const availableNumbers = [];
    for (let i = 1; i <= totalQuestions; i++) {
      if (!questionNumberRequested.current.includes(i)) {
        availableNumbers.push(i);
      }
    }

    if (availableNumbers.length === 0) {
      // If all numbers have been used, reset the array (shouldn't happen in normal flow)
      questionNumberRequested.current = [];
      return Math.floor(Math.random() * totalQuestions) + 1;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNumber = availableNumbers[randomIndex];
    questionNumberRequested.current.push(selectedNumber);

    return selectedNumber;
  };

  // Load initial data on component mount - FIXED with debugging
  useEffect(() => {
    console.log('Questions useEffect triggered', { hasLoadedInitial, isInitialLoading });

    if (!hasLoadedInitial) {
      console.log('Loading initial data...');
      const loadInitialData = async () => {
        try {
          // For initial load, we need to get total_questions first for random mode
          if (quizMode === 'random10') {
            // First get the total questions count
            const initialParams = { question_number: 1 };
            await handleGetData(initialParams);

            // Then get a random question if we have total_questions
            if (data?.total_questions) {
              const randomQuestionNumber = getRandomQuestionNumber(data.total_questions);
              const params = {
                question_number: randomQuestionNumber,
                mode: 'random',
                max_questions: maxQuestions || 10
              };
              await handleGetData(params);
            }
          } else {
            // For fullburst mode, get initial data first to know total_questions
            const initialParams = { question_number: 1 };
            await handleGetData(initialParams);

            if (data?.total_questions) {
              const randomQuestionNumber = getRandomQuestionNumber(data.total_questions);
              const params = { question_number: randomQuestionNumber };
              await handleGetData(params);
            }
          }

          number.current++;
          setHasLoadedInitial(true);
          console.log('Initial data loaded successfully');
        } catch (error) {
          console.error('Error loading initial data:', error);
          setHasLoadedInitial(true); // Set to true even on error to prevent infinite loop
        }
      };

      loadInitialData();
    }
  }, [hasLoadedInitial, quizMode, maxQuestions]); // Only depend on the flag and mode

  const getData = async () => {
    // Check if we've completed all questions before loading next
    if (questionsCompleted >= effectiveMaxQuestions) {
      setShowCongratulations(true);
      return;
    }

    setIsTransitioning(true);

    // Delay the API call to allow fade out animation
    setTimeout(async () => {
      let randomQuestionNumber: number;

      if (data?.total_questions) {
        randomQuestionNumber = getRandomQuestionNumber(data.total_questions);
      } else {
        // Fallback if total_questions is not available
        randomQuestionNumber = Math.floor(Math.random() * 100) + 1;
        questionNumberRequested.current.push(randomQuestionNumber);
      }

      const params = quizMode === 'random10'
        ? { question_number: randomQuestionNumber, mode: 'random', max_questions: maxQuestions || 10 }
        : { question_number: randomQuestionNumber };

      await handleGetData(params);
      number.current++;
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(null);

      // Allow fade in animation after data update
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleRestart = () => {
    setIsTransitioning(true);
    setMode(null);

    // Reset question counter and state
    setTimeout(async () => {
      number.current = 1;
      // Reset the requested questions array
      questionNumberRequested.current = [];
      // Reset score tracking
      setScore(0);
      setTotalQuestions(0);
      setQuestionsCompleted(0);
      setShowCongratulations(false);

      // Get initial random question
      let randomQuestionNumber: number;
      if (data?.total_questions) {
        randomQuestionNumber = getRandomQuestionNumber(data.total_questions);
      } else {
        randomQuestionNumber = 1; // Start with question 1 if total_questions not available
        questionNumberRequested.current.push(randomQuestionNumber);
      }

      const params = quizMode === 'random10'
        ? { question_number: randomQuestionNumber, mode: 'random', max_questions: maxQuestions || 10 }
        : { question_number: randomQuestionNumber };

      await handleGetData(params);
      setSelectedOption(null);
      setShowResult(false);
      setIsCorrect(null);

      // Allow fade in animation after data update
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  const handleOptionSelect = (index: number) => {
    if (isTransitioning || showResult) return;
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    // Check if the selected answer is correct
    const correctAnswerIndex = data?.options?.indexOf(data?.answer);
    const userIsCorrect = selectedOption === correctAnswerIndex;

    setIsCorrect(userIsCorrect);
    setShowResult(true);

    // Update score tracking
    setTotalQuestions(prev => prev + 1);
    setQuestionsCompleted(prev => prev + 1);
    if (userIsCorrect) {
      setScore(prev => prev + 1);
    }

    // Check if this was the last question
    if (questionsCompleted + 1 >= effectiveMaxQuestions) {
      // Show result for 3 seconds, then show congratulations
      setTimeout(() => {
        setShowCongratulations(true);
      }, 3000);
    } else {
      // Auto-advance to next question after showing result
      setTimeout(() => {
        getData();
      }, 3000);
    }
  };

  // Helper function to get the correct answer index
  const getCorrectAnswerIndex = () => {
    return data?.options?.indexOf(data?.answer) ?? -1;
  };

  // Show congratulations screen
  if (showCongratulations) {
    const finalPercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const getPerformanceMessage = () => {
      if (finalPercentage >= 90) return <div className='flex justify-center items-center gap-2'>Outstanding! You're a quiz master! <IoTrophyOutline /></div>;
      if (finalPercentage >= 80) return <div className='flex justify-center items-center gap-2'>Excellent work! Great job! <GiPartyPopper /></div>;
      if (finalPercentage >= 70) return <div className='flex justify-center items-center gap-2'>Well done! Good performance! <PiHandsClapping />
      </div>;
      if (finalPercentage >= 60) return <div className='flex justify-center items-center gap-2'>Not bad! Keep practicing! <LuBicepsFlexed />
      </div>;
      return <div className='flex justify-center items-center gap-2'>Good effort! Practice makes perfect! <PiBooksThin />
      </div>;
    };

    const getGrade = () => {
      if (finalPercentage >= 90) return "A+";
      if (finalPercentage >= 80) return "A";
      if (finalPercentage >= 70) return "B";
      if (finalPercentage >= 60) return "C";
      return "D";
    };

    return (
      <main className="relative">
        <div className="flex min-h-dvh items-center justify-center p-2">
          <div className="text-center max-w-4xl w-full">
            {/* Congratulations Header */}
            <div className="mb-8 animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-4xl md:text-5xl font-bold text-center mb-4">
                Congratulations! {name}
              </div>
              <div className="text-xl text-gray-600">
                You've completed the {quizMode === 'random10' ? 'Random 10' : 'Full Burst'} quiz!
              </div>
            </div>

            {/* Results Card */}
            <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-8 mb-8 shadow-2xl">
              {/* Final Score */}
              <div className="mb-6">
                <div className="text-6xl font-bold mb-2">{finalPercentage}%</div>
                <div className="text-2xl font-bold mb-2">Grade: {getGrade()}</div>
                <div className="text-lg text-gray-600">
                  {score} out of {totalQuestions} correct answers
                </div>
              </div>

              {/* Performance Message */}
              <div className={`
                backdrop-blur-sm rounded-lg p-4 border mb-6
                ${finalPercentage >= 70
                  ? 'bg-green-500/10 border-green-400/20'
                  : finalPercentage >= 50
                    ? 'bg-yellow-500/10 border-yellow-400/20'
                    : 'bg-blue-500/10 border-blue-400/20'
                }
              `}>
                <div className={`
                  font-medium text-lg
                  ${finalPercentage >= 70 ? 'text-green-600' : finalPercentage >= 50 ? 'text-yellow-600' : 'text-blue-600'}
                `}>
                  {getPerformanceMessage()}
                </div>
              </div>

              {/* Quiz Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold">{totalQuestions}</div>
                  <div className="text-sm text-gray-600">Questions Answered</div>
                </div>
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-green-600">{score}</div>
                  <div className="text-sm text-gray-600">Correct Answers</div>
                </div>
                <div className="backdrop-blur-sm bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="text-2xl font-bold text-red-600">{totalQuestions - score}</div>
                  <div className="text-sm text-gray-600">Incorrect Answers</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Try Again Button */}
              <button
                onClick={handleRestart}
                className={`
                  bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20
                  transition-all duration-200 ease-in-out
                  hover:scale-110 hover:bg-white/20 hover:shadow-lg
                  active:scale-95 text-lg font-medium px-8 py-4
                  flex items-center gap-2
                `}
              >
                <MdRefresh className="text-2xl" />
                Try Again
              </button>

              {/* Change Mode Button */}
              <button
                onClick={() => setMode(null)}
                className={`
                  bg-gray-600/20 backdrop-blur-sm rounded-lg p-4 border border-gray-500/20
                  transition-all duration-200 ease-in-out
                  hover:scale-110 hover:bg-gray-600/30 hover:shadow-lg
                  active:scale-95 text-lg font-medium px-8 py-4
                `}
              >
                Choose Different Mode
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show initial loading from context (this will be handled by your layout)
  if (isInitialLoading) {
    return null; // Let the layout handle the initial loading
  }

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

  // Don't render anything if we don't have data yet
  if (!data) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-gray-600 mx-auto mb-4"></div>
          <div className="text-xl font-medium">Loading question...</div>
        </div>
      </div>
    );
  }
  const correctAnswerIndex = getCorrectAnswerIndex();
  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;


  return (
    <main className="relative">
      <div className="flex  items-center justify-center p-2">
        <div className="text-center max-w-4xl w-full">
          {/* Question Header with Brain Icon and Restart Button */}
          <div className={`mb-8 transition-all w-full duration-300 ease-in-out transform ${isTransitioning
            ? 'opacity-0 translate-y-4 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
            }`}>
            <div className="flex items-center justify-center mb-6 relative">
              {/* Score Tracker - Left Side */}
              <div className={`
                absolute left-0 top-1/2 transform -translate-y-1/2
                backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-2 lg:p-3
                transition-all duration-300 ease-in-out
                ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}
                shadow-lg hover:shadow-xl hover:bg-white/15
              `}>
                <div className="text-center">
                  {/* <div className="text-lg font-bold text-gray-700 mb-1">
                    {score}/{totalQuestions}
                  </div> */}
                  {/* <div className="text-xs text-gray-600 mb-1">Score</div> */}
                  {totalQuestions > 0 && (
                    <div className={`
                      text-xs font-medium px-2 py-0.5 rounded-full
                      ${scorePercentage >= 70
                        ? 'bg-green-100 text-green-700'
                        : scorePercentage >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }
                    `}>
                      {scorePercentage}%
                    </div>
                  )}
                </div>
              </div>

              {/* Center Content */}
              <PiBrainThin className="text-4xl lg:text-6xl text-gray-600 mr-4" />
              <div className="lg:text-lg text-sm font-medium text-gray-500">
                Question {number.current - 1}
                <div className="text-sm text-gray-400">
                  {quizMode === 'random10' ? 'Random 10' : 'Full Burst'} Mode
                </div>
              </div>

              {/* Restart Button - Right Side */}
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
          <div className={`text-lg md:text-4xl font-bold text-center pb-8 transition-all duration-300 ease-in-out transform ${isTransitioning
            ? 'opacity-0 translate-y-4 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
            }`}>
            {data?.question}
          </div>

          {/* Options Container */}
          <div className={`min-h-[200px] flex flex-col items-center justify-center lg:mb-8 transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-4 w-full max-w-2xl">
              {data?.options?.map((option: string, index: number) => {
                const isSelected = selectedOption === index;
                const isCorrectOption = index === correctAnswerIndex;
                const shouldShowAsCorrect = showResult && isCorrectOption;
                const shouldShowAsIncorrect = showResult && isSelected && !isCorrectOption;

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    disabled={isTransitioning || showResult}
                    className={`
                      relative overflow-hidden
                      backdrop-blur-sm rounded-lg p-3 lg:p-6 border
                      transition-all duration-300 ease-in-out transform
                      hover:scale-105 hover:-translate-y-1 hover:shadow-2xl
                      active:scale-95
                      disabled:cursor-not-allowed
                      ${!showResult && isSelected
                        ? 'bg-gray-600/20 border-gray-500 scale-105 shadow-2xl'
                        : !showResult ? 'bg-white/10 border-white/20 hover:bg-white/15' : ''
                      }
                      ${shouldShowAsCorrect
                        ? 'bg-green-500/20 border-green-400 scale-105 shadow-2xl'
                        : ''
                      }
                      ${shouldShowAsIncorrect
                        ? 'bg-red-500/20 border-red-400 scale-105 shadow-2xl'
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
                      absolute top-3 left-3 w-6 lg:w-8 h-6 lg:h-8 rounded-full flex items-center justify-center
                      text-sm font-bold transition-all duration-300
                      ${shouldShowAsCorrect
                        ? 'bg-green-500 text-white'
                        : shouldShowAsIncorrect
                          ? 'bg-red-500 text-white'
                          : isSelected
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {String.fromCharCode(65 + index)}
                    </div>

                    {/* Option Text */}
                    <div className="text-left pl-12 pr-4 text-sm lg:text-lg font-medium">
                      {option}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && !showResult && (
                      <div className="absolute top-3 right-3">
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}

                    {/* Result Indicators */}
                    {showResult && (
                      <div className="absolute top-3 right-3">
                        {shouldShowAsCorrect && (
                          <div className="text-green-500 text-xl animate-bounce">✓</div>
                        )}
                        {shouldShowAsIncorrect && (
                          <div className="text-red-500 text-xl animate-bounce">✗</div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result Message */}
            {/* {showResult && (
              <div className={`mt-6 transition-all duration-500 ease-in-out transform ${showResult ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
                }`}>
                <div className={`backdrop-blur-sm rounded-lg p-4 border ${isCorrect
                  ? 'bg-green-500/10 border-green-400/20'
                  : 'bg-red-500/10 border-red-400/20'
                  }`}>
                  <div className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? (
                      "🎉 Correct! Great job!"
                    ) : (
                      <>
                        ❌ Incorrect. The correct answer is: <span className="font-bold">{data?.answer}</span>
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {questionsCompleted >= effectiveMaxQuestions
                      ? "Quiz completed! Showing results..."
                      : "Moving to next question..."
                    }
                  </div>
                </div>
              </div>
            )} */}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center pt-10 justify-center gap-4">
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
            <div className="text-sm text-gray-500 mb-2">
              Question Progress ({number.current - 1} of {effectiveMaxQuestions})
            </div>
            <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((number.current - 1) / effectiveMaxQuestions) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {Math.round(((number.current - 1) / effectiveMaxQuestions) * 100)}% Complete
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