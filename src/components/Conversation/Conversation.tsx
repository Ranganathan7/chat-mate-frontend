import "./Conversation.css";
import React, { useEffect, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import ConversationType from "../../types/conversation.type";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";

interface Props {
	conversation: ConversationType;
}

const Conversation: React.FC<Props> = ({ conversation }) => {
	const isGroup = conversation.conversationName === "" ? false : true;
	const user = useSelector((state: StateType) => state?.userInfo);
	const date = new Date(conversation.updatedAt);
	const dispatch = useDispatch();
	const selectedConversation = useSelector(
		(state: StateType) => state?.selectedConversation
	);

	async function setSelected() {
		dispatch(setSelectedConversation(conversation));
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
							{!conversation.users[0].online && <span className="bg-secondary border border-light rounded-circle online"></span>}
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
							{!conversation.users[1].online && <span className="bg-secondary border border-light rounded-circle online"></span>}
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
						</div>
					</>
				)}
			</div>
		);
	}
};

export default Conversation;
