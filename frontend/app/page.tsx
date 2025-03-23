import Login from "@/components/ui/login"
import Image from "next/image"


  export default function home() {
  return (
    <div className="w-full lg:grid h-[100vh]  bg-zinc-800 lg:grid-cols-2 ">
      <div className="lg:flex items-center hidden h-full justify-center ">
        <Login/>
      </div>
      <div className="hidden overflow-y-hidden lg:flex">
        <Image
          src="/logo.jpg"
          alt="Image"
          width={600} 
          height={600}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="h-96 md:hidden flex items-center justify-center w-full text-2xl font-extrabold">
        VERSION MOBILE NON DISPONIBLE
      </div>
    </div>
  )
}
