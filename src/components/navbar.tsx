import React from 'react'

function Navbar() {
    const [user, setUser] = React.useState("Guest");


    return (
        <div className='w-full flex items-center justify-center h-20 sticky top-0 bg-black text-white'>
            <div className='w-11/12 m-auto flex items-center justify-around'>
                <div>Video-Transcription</div>
                <div>User: {user}</div>
            </div>

        </div>
    )
}

export default Navbar
