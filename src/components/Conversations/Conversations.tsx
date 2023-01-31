import "./Conversations.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import { getConversationsRequest } from "../apiCalls/getConverrsations.request";
import setConversations from "../../redux/actions/setConversations";
import { toast } from "react-toastify";
import ConversationType from "../../types/conversation.type";
import Conversation from "../Conversation/Conversation";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import { getConversationRequest } from "../apiCalls/getConversation.request";
import { Socket } from "socket.io-client";
import { userInfo } from "os";
import UserType from "../../types/user.type";
import setNotifications from "../../redux/actions/setNotifications";

interface Props {
	socket: Socket | undefined
}

const Conversations: React.FC<Props> = ({socket}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch();
	const conversations = useSelector((state: StateType) => state?.conversations);
	const selectedConversation = useSelector((state: StateType) => state?.selectedConversation)
	const user: UserType = JSON.parse(localStorage.getItem('userInfo') as string)
	
	useEffect(() => {
        const getConversations_ = async () => {
			await getConversations()
		}

		getConversations_()

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		const updateConversation = async () => {
			setLoading(true)
			const conversation = await getConversationRequest(selectedConversation?._id as string)
			dispatch(setSelectedConversation(conversation.res));
			setLoading(false)
		}
		if(selectedConversation?._id) {
			updateConversation()
		}

		// eslint-disable-next-line
	}, [conversations])

	async function getConversations() {
        setLoading(true)
		const conversations = await getConversationsRequest();
		setLoading(false);
		if (conversations.res) {
			dispatch(setConversations(conversations.res));
			const notifications: string[] = []
			conversations.res?.map((conversation: ConversationType) => {
				if(conversation.updatedAt > user.lastOnline) notifications.push(conversation._id)
			})
			dispatch(setNotifications(notifications))
		}
		else
			toast.error(conversations.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
	}

	if (!conversations && loading) {
		return (
			<div className="conversations-loading">
				<div className="spinner-grow text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow text-secondary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow text-success" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow text-danger" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow text-warning" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow text-info" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
				<div className="spinner-grow text-dark" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

    else if(conversations?.length === 0) {
        return(
            <div className="conversations-empty">
				<h4 style={{color: "grey"}}>Search for Your Friends and Start a New Conversation!</h4>
                <img src="/images/chat-background-empty.jpg" height="50%" width="50%" alt="No Conversations to Show" />
            </div>
        )
    }

    else{
        return (
            <div className="conversations">
                {
                    (conversations as ConversationType[])?.map((conversation: ConversationType) => 
                        <Conversation key={conversation._id} conversation={conversation} socket={socket}/>
                    )
                }  
            </div>
        )
    }
};

export default Conversations;
