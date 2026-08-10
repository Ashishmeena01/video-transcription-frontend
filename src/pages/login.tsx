import { BsGoogle } from "react-icons/bs"

function Login() {
  return (
    <div className="w-full h-full bg-amber-50 flex items-center justify-center">
        <button onClick={()=>console.log("heloo")} className="bg-black w-52 shadow-2xl shadow-blue-600 border-red-900 cursor-pointer border-2 flex items-center justify-around text-white p-2.5 px-3 rounded-2xl"><BsGoogle/> Sign in with Google</button>
    </div> 
  )
}

export default Login
