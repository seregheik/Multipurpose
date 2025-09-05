"use client"
import Link from "next/link"
import { PiBrainThin } from "react-icons/pi";
import ThemeToggle from "../Theme/themeToggle"
import { useState } from "react";

const Navbar = () => {
  const [userName, setUsername] = useState("User")

    const name = localStorage.getItem("QizzAppName") || userName

  return (
    <nav className="py-4 sticky top-0 shadow-md flex justify-between px-3">
      <Link href={"/quiz"} className="flex items-center gap-4">
        <PiBrainThin className="text-5xl" />
        <h1 className="text-2xl font-bold text-gray-800">Quiz App</h1>
      </Link>
      <div className="flex items-center gap-4">
        <div className="text-gray-800 hover:text-gray-600">{name}</div>
        {/* <Link href={"/quiz"} className="text-gray-800 hover:text-gray-600">Quiz</Link> */}
      </div>
      <ThemeToggle />
    </nav>
  )
}

export default Navbar