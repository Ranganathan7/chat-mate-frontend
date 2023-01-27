import "./UserInfo.css"
import React, { useEffect } from "react"
import StateType from "../../types/state.type"
import { useDispatch, useSelector } from "react-redux"
import UserType from "../../types/user.type"
import Avatar from "@mui/material/Avatar"
import ConversationType from "../../types/conversation.type"
import setSelectedConversation from "../../redux/actions/setSelectedConversation"

interface Props {
    showGroupInfo: React.Dispatch<React.SetStateAction<boolean>>
    showUserInfo: React.Dispatch<React.SetStateAction<boolean>>
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const UserInfo: React.FC<Props> = ({showUserInfo, showGroupInfo}) => {

    const conversation = useSelector((state: StateType) => state?.selectedConversation)
    const loggedUser = useSelector((state: StateType) => state?.userInfo)
    const user: UserType = (conversation?.users[0]._id === loggedUser?._id) ? conversation?.users[1] as UserType : conversation?.users[0] as UserType
    const conversations = useSelector((state: StateType) => state?.conversations)
    const dispatch = useDispatch()

    useEffect(() => {
        if(conversation?.conversationName !== "") showGroupInfo(true)
        else showGroupInfo(false)

        // eslint-disable-next-line
    }, [conversation])

    function getLastOnline(lastOnline: Date): string {
		const date = new Date(lastOnline)
		return date.toLocaleDateString("en-US") + ", " + date.toLocaleTimeString()
	}

    function containsUser(conversation: ConversationType) {
        let res = false;
        conversation.users.map((c_user: UserType) => {
            if(c_user._id === user._id) res = true 
            return c_user
        })
        return res;
    }

    function takeToGroup(conversation: ConversationType) {
        dispatch(setSelectedConversation(conversation))
    }

    return(
        <div className="right-user-info">
            <div className="close-info" onClick={() => showUserInfo(false)}>
                <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="user-pic">
                <Avatar
					alt={user?.name}
					src={user?.pic}
					sx={{ width: 150, height: 150 }}
					style={{ border: "2px solid black" }}
				/>
            </div>
            <div className="user-online">
                {user.online && "ONLINE"}
				{!user.online && "Last seen at " + getLastOnline(user.lastOnline)}
            </div>
            <div className="user-name">
                {user.name}
            </div>
            <div className="user-email">
                {user.email}
            </div>
            <div className="groups-in-common-title">
                Groups in Common
            </div>
            <div className="groups-in-common">
                {conversations?.map((conversation: ConversationType) => {
                    if(conversation.conversationName !== "" && containsUser(conversation)) {
                        return(
                            <div className="groups" key={conversation._id} onClick={() => takeToGroup(conversation)}>
                                <Avatar
					                alt={conversation.conversationName}
					                src={conversation.conversationPic}
					                sx={{ width: 40, height: 40 }}
					                className="group-pic"
				                />
                                <span className="group-name">{conversation.conversationName}</span>
                            </div>
                        )
                    }
                    else return(
                        <React.Fragment key={conversation._id}></React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}

export default UserInfo