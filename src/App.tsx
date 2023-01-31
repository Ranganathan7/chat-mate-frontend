import React, { useEffect, useState } from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ChatMate from "./components/ChatMate/ChatMate"
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Signup from "./components/Signup/Signup"
import ChatsHome from "./components/ChatsHome/ChatsHome"
import { PageNotFound } from "./components/PageNotFount/PageNotFound"
import { MobileApp } from "./components/MobileApp/MobileApp"

const App: React.FC = () => {

  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth)
  const [windowHeight, setWindowHeight] = useState<number>(window.innerHeight)

  function setWindowDimensions() {
    setWindowWidth(window.innerWidth)
    setWindowHeight(window.innerHeight)
    console.log(window.innerWidth, window.innerHeight)
  }

  useEffect(() => {
    window.addEventListener('resize', setWindowDimensions)
    return(() => {
      window.addEventListener('resize', setWindowDimensions)
    })
  }, [])

  if(window.innerWidth > 1200 && window.innerHeight > 450) return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatMate />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chats" element={<ChatsHome />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )

  else return (
    <MobileApp />
  )
}

export default App
