import React, { useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
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
import toast, {Toaster} from 'react-hot-toast'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUser } from './features/user/userSlice.js'
import { fetchConnections } from './features/connections/connectionSlice.js'
import { addMessage } from './features/messages/messagesSlice.js'
import Notification from './components/Notification.jsx'

export default function App() {
  const {user}=useUser()
  const {getToken}=useAuth()
  const dispatch=useDispatch()
  const {pathname}=useLocation()
  const pathnameRef=useRef(pathname)
  
  useEffect(()=>{
    const fetchData=async()=>{
if(user){
const token=await  getToken()
 console.log("👉 Clerk JWT token:", token)
dispatch(fetchUser(token))
dispatch(fetchConnections(token))
}
    }
    fetchData()
  },[user,getToken,dispatch])

useEffect(()=>{
pathnameRef.current=pathname
},[pathname])

useEffect(()=>{
  if(user){
    const eventSource=new EventSource(import.meta.env.VITE_BASE_URL+'api/message/'+user.id)
    eventSource.onmessage=(event)=>{
      const message=JSON.parse(event.data)
      if(pathnameRef.current===('/messages/'+message.from_user_id)){
        dispatch(addMessage(message))
      }
      else{
toast.custom((t)=>(
  <Notification t={t} message={message}/>
),{position:"bottom-right"})
      }
    }
    return ()=>{
      eventSource.close()
    }
  }
},[user, dispatch])

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
