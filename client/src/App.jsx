import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import CreatePost from './pages/CreatePost'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Layout from './pages/Layout'
import Profile from './pages/Profile'
import { useUser, useAuth } from '@clerk/clerk-react'
import {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'

export default function App() {
  const {user}=useUser()
  const {getToken}=useAuth()
  useEffect(()=>{
if(user){
  getToken().then((token)=>
  
  console.log(token)
)
}
  },[user])
  return (
    <>
    <Toaster />
      <Routes>
        <Route path="/" element={!user?<Login />:<Layout />} >
        <Route index element={<Feed />} />
        <Route path="profile/:porfileId" element={<Profile />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="connections" element={<Connections />} />
        <Route path="discover" element={<Discover />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:userId" element={<ChatBox />} />
        <Route path="layout" element={<Layout />} />
        </Route>
      </Routes>
    </>
  )
}
