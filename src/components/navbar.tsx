import React from 'react'
import { CiUser } from "react-icons/ci";

function Navbar() {
    const [user, setUser] = React.useState("Guest");


    return (
        <div className='w-full flex items-center justify-center h-20 sticky top-0 bg-black text-white'>
            <div className='w-11/12 m-auto flex items-center justify-around'>
                <div>Video-Transcription</div>
                <div className='rounded-full bg-red-100 p-1'> <CiUser className='text-black '/> </div>
            </div>

        </div>
    )
}

export default Navbar
