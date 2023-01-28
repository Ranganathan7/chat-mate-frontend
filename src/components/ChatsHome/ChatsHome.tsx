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

    async function online() {
        const onlineUser = await editProfileRequest("", "", true)
        if(onlineUser.res) {
            localStorage.setItem("userInfo", JSON.stringify(onlineUser.res))
            dispatch(setUserInfo(JSON.stringify(onlineUser.res)))
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
        }
        else {
            toast.error(offlineUser.error, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        }
    }

    useEffect(() => {
        setLoading(true)
        if(!localStorage.getItem("userInfo")){
            toast.info("Please login to access that page", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
			navigate("/home")
		}
        dispatch(setUserInfo(localStorage.getItem("userInfo") as string))
        setLoading(false)
        online()
        window.addEventListener("focus", online)
        window.addEventListener("blur", offline)

        return () => {
            window.removeEventListener("focus", online)
            window.removeEventListener("blur", offline)
        }

        // eslint-disable-next-line
    }, [])

    if(loading){
        return (
            <Loading />
        )
    }

    return (
        <div className="chats-home-container">
            <Navbar />
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
                    {showCreateGroup && <CreateGroup setShowCreateGroup={setShowCreateGroup}/>}
                    {showSearch && <SearchUser setShowSearch={setShowSearch} />}
                    {!showEditProfile && !showCreateGroup && !showSearch && <Conversations />}
                </div>
                <div className={(showGroupInfo || showUserInfo) ? "col mid right" : "col mid"}>
                    <Chats showGroupInfo={setShowGroupInfo} showUserInfo={setShowUserInfo}/>
                </div>
                {(showGroupInfo || showUserInfo) && <div className="col-3 right">
                    {showGroupInfo && <GroupInfo showGroupInfo={setShowGroupInfo} showUserInfo={setShowUserInfo} showEditProfile={setShowEditProfile} loading={rightLoading} setLoading={setRightLoading}/>}
                    {showUserInfo && <UserInfo showUserInfo={setShowUserInfo} showGroupInfo={setShowGroupInfo} loading={rightLoading} setLoading={setRightLoading}/>}
                </div>}
            </div>
        </div>
    )
}

export default ChatsHome