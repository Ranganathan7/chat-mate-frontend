import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import setConversations from "../../redux/actions/setConversations"
import setUserInfo from "../../redux/actions/setUserInfo"
import StateType from "../../types/state.type"
import { editProfileRequest } from "../apiCalls/editProfile.request"
import { getConversationsRequest } from "../apiCalls/getConverrsations.request"
import Chats from "../Chats/Chats"
import Conversations from "../Conversations/Conversations"
import CreateGroup from "../CreateGroup/CreateGroup"
import EditProfile from "../EditProfile/EditProfile"
import GroupInfo from "../GroupInfo/GroupInfo"
import Loading from "../Loading/Loading"
import Navbar from "../Navbar/Navbar"
import ProfileNavbar from "../ProfileNavbar/ProfileNavbar"
import SearchUser from "../SearchUser/SearchUser"
import UserInfo from "../UserInfo/UserInfo"
import "./ChatsHome.css"
import io, { Socket } from "socket.io-client"
import { logoutRequest } from "../apiCalls/logout.request"
import clearStore from "../../redux/actions/clearStore"
import { endpoint } from "../apiCalls/ENDPOINT"

const ENDPOINT = endpoint

const ChatsHome: React.FC = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading ,setLoading] = useState<boolean>(false)
    const [showSearch, setShowSearch] = useState<boolean>(false)
    const [showEditProfile, setShowEditProfile] = useState<boolean>(false)
    const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false)
    const [showGroupInfo, setShowGroupInfo] = useState<boolean>(false)
    const [showUserInfo, setShowUserInfo] = useState<boolean>(false)
    const [rightLoading, setRightLoading] = useState<boolean>(false)
    const [socket, setSocket] = useState<Socket>()
    let newSocket: Socket

    useEffect(() => {
        newSocket = io(ENDPOINT)
		setSocket(newSocket)
        setLoading(true)
        if(!localStorage.getItem("userInfo")){
            toast.info("Please login to access that page", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
			navigate("/home")
		}
        else {
            dispatch(setUserInfo(localStorage.getItem("userInfo") as string))
            online()
            newSocket.emit("userOnline")
            newSocket.emit("joinChatMate", {userId: JSON.parse(localStorage.getItem("userInfo") as string)._id})
        }
        setLoading(false)
        window.addEventListener("focus", online)
        window.addEventListener("blur", offline)
        // window.addEventListener("beforeunload", logout)

        return(() => {
            window.removeEventListener("focus", online)
            window.removeEventListener("blur", offline)
            // window.removeEventListener("beforeUnload", logout)
        })

        // eslint-disable-next-line
    }, [])

    async function online() {
        const onlineUser = await editProfileRequest("", "", true)
        if(onlineUser.res) {
            localStorage.setItem("userInfo", JSON.stringify(onlineUser.res))
            dispatch(setUserInfo(JSON.stringify(onlineUser.res)))
            newSocket.emit("userOnline")
        }
        else {
            toast.error(onlineUser.error, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        }
    }

    async function offline() {
        const offlineUser = await editProfileRequest("", "", false)
        if(offlineUser.res) {
            localStorage.setItem("userInfo", JSON.stringify(offlineUser.res))
            dispatch(setUserInfo(JSON.stringify(offlineUser.res)))
            newSocket.emit("userOnline")
        }
        else {
            toast.error(offlineUser.error, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        }
    }

    if(loading){
        return (
            <Loading />
        )
    }

    return (
        <div className="chats-home-container">
            <Navbar socket={socket}/>
            <div className="row">
                <div className="col-3 left">
                    <ProfileNavbar 
                        setShowSearch={setShowSearch} 
                        showSearch={showSearch}
                        setShowEditProfile={setShowEditProfile} 
                        showEditProfile={showEditProfile}
                        setShowCreateGroup={setShowCreateGroup} 
                        showCreateGroup={showCreateGroup} 
                    />
                    {showEditProfile && <EditProfile />}
                    {showCreateGroup && <CreateGroup setShowCreateGroup={setShowCreateGroup} socket={socket}/>}
                    {showSearch && <SearchUser setShowSearch={setShowSearch} />}
                    {!showEditProfile && !showCreateGroup && !showSearch && <Conversations socket={socket}/>}
                </div>
                <div className={(showGroupInfo || showUserInfo) ? "col mid right" : "col mid"}>
                    <Chats showGroupInfo={setShowGroupInfo} showUserInfo={setShowUserInfo} socket={socket} />
                </div>
                {(showGroupInfo || showUserInfo) && <div className="col-3 right">
                    {showGroupInfo && <GroupInfo showGroupInfo={setShowGroupInfo} showUserInfo={setShowUserInfo} showEditProfile={setShowEditProfile} loading={rightLoading} setLoading={setRightLoading} socket={socket}/>}
                    {showUserInfo && <UserInfo showUserInfo={setShowUserInfo} showGroupInfo={setShowGroupInfo} loading={rightLoading} setLoading={setRightLoading}/>}
                </div>}
            </div>
        </div>
    )
}

export default ChatsHome