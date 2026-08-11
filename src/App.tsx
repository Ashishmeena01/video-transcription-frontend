import { BrowserRouter, Link, redirect, Route, Routes } from "react-router-dom"
import Navbar from "./components/navbar"
import Login from "./pages/login"
import { HoverBorderGradient } from "./components/ui/hover-border-gradient"



function Home() {
  return (
    <>
      <Navbar />
      <div className="top-0 w-full h-full flex flex-col gap-3 items-center justify-center bg-black text-white">
        <div className="text-6xl flex items-center justify-center font-semibold">Caption your  video easily with capvi</div>
        <div>
          <HoverBorderGradient as={"button"} children={<Link to="/captioning">Start Captioning</Link>}
            onClick={() => {
              console.log("clicked");
              redirect("http://localhost:5173/captioning")
            }} />
        </div>
      </div>
    </>
  )
}


function Captioning(){
  return(
    <div className="w-full h-full flex items-center justify-center">
      start captioning
    </div>
  )
}


function App() {

  return (
    <>
      <main className="w-full h-screen bg-white text-black">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}
            ></Route>

            <Route path="/login" element={<Login />}>
            </Route>

            <Route path="/captioning" element={<Captioning/>}>
            </Route>

            <Route path="/*" element={"404 page not found"}/>
          </Routes>
        </BrowserRouter>
      </main>
    </>
  )
}

export default App
