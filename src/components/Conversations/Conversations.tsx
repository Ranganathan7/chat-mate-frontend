import "./Conversations.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import { getConversationsRequest } from "../apiCalls/getConverrsations.request";
import setConversations from "../../redux/actions/setConversations";
import { toast } from "react-toastify";
import ConversationType from "../../types/conversation.type";
import Conversation from "../Conversation/Conversation";

const Conversations: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch();
	const conversations = useSelector((state: StateType) => state?.conversations);
	
	useEffect(() => {
        const getConversations_ = async () => {
			await getConversations()
		}

		getConversations_()

		// eslint-disable-next-line
	}, []);

	async function getConversations() {
        setLoading(true)
		const conversations = await getConversationsRequest();
		setLoading(false);
		if (conversations.res) dispatch(setConversations(conversations.res));
		else
			toast.error(conversations.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
	}

	if (loading) {
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
                        <Conversation key={conversation._id} conversation={conversation} />
                    )
                }  
            </div>
        )
    }
};

export default Conversations;
