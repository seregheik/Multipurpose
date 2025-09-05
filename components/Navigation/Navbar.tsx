import Link from "next/link"
const Navbar = () => {
  return (
    <div className="border-b py-5">
      
      <h1 className="font-bold px-2 font-2xl text-blue-700">
        <Link href={"/"}>
        Osasere's Lambda Project
        </Link>
      </h1>
     
      </div>
  )
}

export default Navbar