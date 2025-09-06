"use client"
import ThemeToggle from "@/components/Theme/themeToggle";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useState, useRef } from "react";
import { introSetup } from "@/utils/data/introQuestions";
import { PiBrainThin } from "react-icons/pi";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie"
export default function Home() {
    const [text, setText] = useState(introSetup[0])
    const tracker = useRef(0)
    const [displayField, setDisplayField] = useState(false)
    const [displayTheme, setDisplayTheme] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [displayGameType, setDisplayGameType] = useState(false)
    const [name, setName] = useState("")
    const router = useRouter()

    // const data = useAppProvider();
    // const updatedData = data.handleGetData;
    // const handleClick = () => {
    //     updatedData();
    // }

    // Helper function to update display state based on current tracker value
    const updateDisplayState = () => {
        setText(tracker.current < 3 ? introSetup[tracker.current] : introSetup[tracker.current] + " " + name)

        switch (tracker.current) {
            case 0:
                setDisplayTheme(false)
                setDisplayField(false)
                break;
            case 1:
                setDisplayTheme(true)
                setDisplayField(false)
                break;
            case 2:
                setDisplayGameType(false)
                setDisplayTheme(false)
                setDisplayField(true)
                break;
            case 3:
                setLocalUserName()
                Cookies.set("QizzAppName", name)
                setDisplayField(false)
                setDisplayGameType(true)
                break;
            default:
                setDisplayTheme(false)
                setDisplayField(false)
                break;
        }
    }

    // Handle next button click
    const handleNext = () => {
        // Check if we're on the last step
        if (tracker.current >= introSetup.length - 1) {
            // Route to the next page (adjust the route as needed)
            router.push('/quiz'); // Change '/quiz' to your desired route
            return;
        }

        setIsTransitioning(true)
        // Delay the state change to allow fade out animation
        setTimeout(() => {
            tracker.current++
            updateDisplayState()
            // Allow fade in animation after state update
            setTimeout(() => {
                setIsTransitioning(false)
            }, 50)
        }, 300) // Match this with CSS transition duration
    }

    // Handle previous button click
    const handlePrevious = () => {
        if (tracker.current <= 0) return; // Prevent going below first step
        setIsTransitioning(true)
        // Delay the state change to allow fade out animation
        setTimeout(() => {
            tracker.current--
            updateDisplayState()
            // Allow fade in animation after state update
            setTimeout(() => {
                setIsTransitioning(false)
            }, 50)
        }, 300)
    }

    const getValues = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const setLocalUserName = () => {
        localStorage.setItem("QizzAppName", name)
    }

    // Check if we're on the last step
    const isLastStep = tracker.current >= introSetup.length - 1;

    return (
        <main>
            <div className="flex min-h-dvh items-center justify-center p-24">
                <div className="text-center">
                    {/* Animated text with smooth transitions */}
                    <div className={`text-4xl font-bold text-center  pb-8 transition-all duration-300 ease-in-out transform ${isTransitioning
                        ? 'opacity-0 translate-y-4 scale-95'
                        : 'opacity-100 translate-y-0 scale-100'
                        }`}>
                        {text}
                    </div>
                    {/* Content container with smooth height transitions */}
                    <div className="min-h-[120px] flex flex-col items-center justify-center mb-8 transition-all duration-300 ease-in-out">
                        {/* Form field with slide up animation */}
                        <div className={`transition-all duration-500 ease-in-out transform ${displayField && !isTransitioning
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
                            }`}>
                            {displayField && (
                                <form className="w-full max-w-md">
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg text-center p-6 border border-white/20">
                                        <input
                                            value={name}
                                            onChange={getValues}
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full text-center px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                                        />
                                    </div>
                                </form>
                            )}
                        </div>
                        {/* Theme toggle with slide down animation */}
                        <div className={`transition-all duration-500 ease-in-out transform ${displayTheme && !isTransitioning
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 -translate-y-8 scale-95 pointer-events-none'
                            }`}>
                            {displayTheme && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                    <ThemeToggle />
                                </div>
                            )}
                        </div>
                        {/* Game type selection with slide down animation */}
                        <div className={`transition-all duration-500 ease-in-out transform ${displayGameType && !isTransitioning
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'opacity-0 -translate-y-8 scale-95 pointer-events-none'
                            }`}>
                            {displayGameType && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border text-center border-white/20">
                                    <div className="flex flex-wrap justify-center gap-4">
                                        <PiBrainThin className="text-7xl w-full" />
                                        <div className="w-full">Its Brain Time</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Navigation buttons */}
                    <div className="flex items-center justify-center gap-4">
                        {/* Previous button - only show if not on first step */}
                        <button
                            onClick={handlePrevious}
                            disabled={isTransitioning || tracker.current <= 0}
                            className={`
                                bg-white rounded-full border border-gray-200 cursor-pointer p-3 
                                shadow-lg hover:shadow-2xl active:shadow-md
                                transform transition-all duration-200 ease-in-out
                                hover:scale-110 hover:-translate-y-1 active:scale-95
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                ${isTransitioning ? 'animate-pulse' : ''}
                                ${tracker.current <= 0 ? 'opacity-30 pointer-events-none' : 'opacity-100'}
                            `}
                            title="Go Back"
                        >
                            <IoIosArrowBack className={`
                                 text-4xl transition-transform duration-200 ease-in-out
                                ${isTransitioning ? '-rotate-90' : 'group-hover:-translate-x-1'}
                            `} />
                        </button>
                        {/* Next/Start button */}
                        <button
                            onClick={handleNext}
                            disabled={isTransitioning}
                            className={`
                                 rounded-full border border-gray-200 cursor-pointer p-3 
                                shadow-lg hover:shadow-2xl active:shadow-md
                                transform transition-all duration-200 ease-in-out
                                hover:scale-110 hover:-translate-y-1 active:scale-95
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                ${isTransitioning ? 'animate-pulse' : ''}
                                ${isLastStep ? 'bg-gray-600 border-gray-600 hover:bg-gray-600' : 'bg-white'}
                            `}
                            title={isLastStep ? "Start Quiz" : "Continue"}
                        >
                            <IoIosArrowForward className={`
                                ${isLastStep ? 'text-white' : ' text-black'} text-4xl transition-transform duration-200 ease-in-out
                                ${isTransitioning ? 'rotate-90' : 'group-hover:translate-x-1'}
                            `} />
                        </button>
                    </div>
                    {/* Optional: Step indicator */}
                    <div className="mt-6 flex justify-center gap-2">
                        {introSetup.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === tracker.current
                                    ? 'bg-gray-500 scale-125'
                                    : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}