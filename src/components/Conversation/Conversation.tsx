import "./Conversation.css";
import React, { useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import ConversationType from "../../types/conversation.type";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import { Socket } from "socket.io-client";
import removeNotification from "../../redux/actions/removeNotification";

interface Props {
	conversation: ConversationType;
	socket: Socket | undefined
}

const Conversation: React.FC<Props> = ({ conversation, socket }) => {
	const isGroup = conversation.conversationName === "" ? false : true;
	const user = useSelector((state: StateType) => state?.userInfo);
	const date = new Date(conversation.updatedAt);
	const dispatch = useDispatch();
	const conversations = useSelector((state: StateType) => state?.conversations)
	const selectedConversation = useSelector(
		(state: StateType) => state?.selectedConversation
	);
	const notifications = useSelector((state: StateType) => state?.notifications)

	useEffect(() => {
		if(conversation._id === selectedConversation?._id) dispatch(setSelectedConversation(conversation))

		// eslint-disable-next-line
	}, [conversations])

	async function setSelected() {
		dispatch(setSelectedConversation(conversation));
		socket?.emit("joinConversation", {conversationId: conversation._id})
		dispatch(removeNotification(conversation._id))
	}

	if (isGroup) {
		return (
			<div
				className={
					selectedConversation?._id === conversation._id
						? "conversation highlight"
						: "conversation"
				}
				onClick={setSelected}
			>
				<div className="pic">
					<Avatar
						alt={conversation.conversationName}
						src={conversation.conversationPic}
					/>
				</div>
				<div className="messager">
					<p className="title">{conversation.conversationName}</p>
					<p className="message">
						<b>
							{conversation.latestMessager.name === user?.name
								? "You"
								: conversation.latestMessager.name}
							:
						</b>{" "}
						{conversation.latestMessage.slice(0, 25)}
						{conversation.latestMessage.length >= 25 && <b>...</b>}
					</p>
				</div>
				<div className="time">
					<p className="date">{date.toLocaleDateString()}</p>
					<p className="date">
						{date.getHours()}:{date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()}
					</p>
					{notifications?.includes(conversation._id) && <div className="dot"></div>}
				</div>
			</div>
		);
	} else {
		return (
			<div
				className={
					selectedConversation?._id === conversation._id
						? "conversation highlight"
						: "conversation"
				}
				onClick={setSelected}
			>
				{conversation.users[0]._id !== user?._id && (
					<>
						<div className="pic">
							<Avatar
								alt={conversation.users[0].name}
								src={conversation.users[0].pic}
								style={{border: "1px solid black"}}
							/>
							{conversation.users[0].online && <span className="bg-success border border-light rounded-circle online"></span>}
							{!conversation.users[0].online && <span className="bg-dark border border-light rounded-circle online"></span>}
						</div>
						<div className="messager">
							<p className="title">{conversation.users[0].name}</p>
							<p className="message">
								<b>
									{conversation.latestMessager.name === user?.name
										? "You"
										: conversation.latestMessager.name}
									:
								</b>{" "}
								{conversation.latestMessage.slice(0, 25)}
								{conversation.latestMessage.length >= 25 && <b>...</b>}
							</p>
						</div>
						<div className="time">
							<p className="date">{date.toLocaleDateString()}</p>
							<p className="date">
								{date.getHours()}:{date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()}
							</p>
							{notifications?.includes(conversation._id) && <div className="dot"></div>}
						</div>
					</>
				)}
				{conversation.users[1]._id !== user?._id && (
					<>
						<div className="pic">
							<Avatar
								alt={conversation.users[1].name}
								src={conversation.users[1].pic}
							/>
							{conversation.users[1].online && <span className="bg-success border border-light rounded-circle online"></span>}
							{!conversation.users[1].online && <span className="bg-dark border border-light rounded-circle online"></span>}
						</div>
						<div className="messager">
							<p className="title">{conversation.users[1].name}</p>
							<p className="message">
								<b>
									{conversation.latestMessager.name === user?.name
										? "You"
										: conversation.latestMessager.name}
									:
								</b>{" "}
								{conversation.latestMessage.slice(0, 25)}
								{conversation.latestMessage.length >= 25 && <b>...</b>}
							</p>
						</div>
						<div className="time">
							<p className="date">{date.toLocaleDateString()}</p>
							<p className="date">
								{date.getHours()}:{date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()}
							</p>
							{notifications?.includes(conversation._id) && <div className="dot"></div>}
						</div>
					</>
				)}
			</div>
		);
	}
};

export default Conversation;
