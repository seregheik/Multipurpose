"use client"
import ThemeToggle from "@/components/Theme/themeToggle";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useState, useRef } from "react";
import { introSetup } from "@/data/introQuestions";
import { useAppProvider } from "@/Context/basicProvider";

export default function Home() {
    const [text, setText] = useState(introSetup[0])
    const tracker = useRef(0)
    const [displayField, setDisplayField] = useState(false)
    const [displayTheme, setDisplayTheme] = useState(false)
    const [isTransitioning, setIsTransitioning] = useState(false)

    // const data = useAppProvider();
    // const updatedData = data.handleGetData;
    // const handleClick = () => {
    //     updatedData();
    // }

    // Helper function to update display state based on current tracker value
    const updateDisplayState = () => {
        setText(introSetup[tracker.current])

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
                setDisplayTheme(false)
                setDisplayField(true)
                break;
            default:
                setDisplayTheme(false)
                setDisplayField(false)
                break;
        }
    }

    // Handle next button click
    const handleNext = () => {
        if (tracker.current >= introSetup.length - 1) return; // Prevent going beyond last step

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

    return (
        <main>
            <div className="flex min-h-dvh items-center justify-center p-24">
                <div className="text-center">
                    {/* Animated text with smooth transitions */}
                    <div className={`text-4xl font-bold text-center pb-8 transition-all duration-300 ease-in-out transform ${isTransitioning
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
                                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                                        <input
                                            type="text"
                                            placeholder="Enter your name..."
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
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
                                text-black text-4xl transition-transform duration-200 ease-in-out
                                ${isTransitioning ? '-rotate-90' : 'group-hover:-translate-x-1'}
                            `} />
                        </button>

                        {/* Next button */}
                        <button
                            onClick={handleNext}
                            disabled={isTransitioning || tracker.current >= introSetup.length - 1}
                            className={`
                                bg-white rounded-full border border-gray-200 cursor-pointer p-3 
                                shadow-lg hover:shadow-2xl active:shadow-md
                                transform transition-all duration-200 ease-in-out
                                hover:scale-110 hover:-translate-y-1 active:scale-95
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                                ${isTransitioning ? 'animate-pulse' : ''}
                                ${tracker.current >= introSetup.length - 1 ? 'opacity-30 pointer-events-none' : 'opacity-100'}
                            `}
                            title="Continue"
                        >
                            <IoIosArrowForward className={`
                                text-black text-4xl transition-transform duration-200 ease-in-out
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