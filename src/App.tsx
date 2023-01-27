import React from "react"
import "./App.css"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ChatMate from "./components/ChatMate/ChatMate"
import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Signup from "./components/Signup/Signup"
import ChatsHome from "./components/ChatsHome/ChatsHome"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChatMate />}/>
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chats" element={<ChatsHome />} />
      </Routes>
    </Router>
  )
}

export default App
