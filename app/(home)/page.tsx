"use client"
import ThemeToggle from "@/components/Theme/themeToggle";
import { IoIosArrowForward } from "react-icons/io";
import { useState, useRef } from "react";
import { introSetup } from "@/data/introQuestions";
import { useAppProvider } from "@/Context/basicProvider";
export default function Home() {
    const [text, setText] = useState(introSetup[0])
    const tracker = useRef(0)
    const [displayField, setDisplayField] = useState(false)
    const [displayTheme, setDisplayTheme] = useState(false)
    // const data = useAppProvider();
    // const updatedData = data.handleGetData;
    // // console.log(updatedData);
    // // console.log(data.handleGetData());
    // const handleClick = () => {
    //     updatedData();
    // }
    const handleNext =()=>{
        setText(introSetup[1])
        tracker.current++
        switch (tracker.current) {
            case 1:
                setText(introSetup[1])
                setDisplayTheme(true)
                break;
            case 2:
                setDisplayTheme(false)
                setText(introSetup[2])
                setDisplayField(true)
                break;
            default:
                break;
        }
        
    }
    return (
        <main>
            <div className="flex min-h-dvh items-center justify-center p-24">
                <div className="text-center">
                    <div className="text-4xl font-bold text-center pb-4">{text}</div>
                    {
                        displayField ? <form>yes</form> : null
                    }
                    {
                        displayTheme ? <ThemeToggle /> : null
                    }
                    <button onClick={handleNext} className="bg-white rounded-full border border-gray-200 cursor-pointer p-2 shadow-xs hover:shadow-2xl" title="Start Quiz"><IoIosArrowForward className="text-black text-4xl" /></button>
                </div>
            </div>
        </main>
    );
}
