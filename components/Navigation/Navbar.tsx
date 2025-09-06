"use client"
import Link from "next/link"
import { PiBrainThin } from "react-icons/pi";
import ThemeToggle from "../Theme/themeToggle"
import { useEffect, useState } from "react";
const Navbar = () => {
  const [userName, setUsername] = useState("")
    const [name, setName] = useState(userName)
useEffect(() => {
  const storedName = localStorage.getItem("QizzAppName")
  if (storedName) {
    setName(storedName)
  } else {
    setName("Wondering User")
  }
}, [])
  return (
    <nav className="navbar bg-adapt z-50">
      <Link href={"/quiz"} className="flex items-center gap-4">
        <PiBrainThin className="text-3xl lg:text-5xl" />
        <h1 className="text-lg lg:text-2xl font-bold">Quiz App</h1>
      </Link>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">{name}</div>
        {/* <Link href={"/quiz"} className="text-gray-800 hover:text-gray-600">Quiz</Link> */}
      </div>
      <ThemeToggle />
    </nav>
  )
}
export default Navbar