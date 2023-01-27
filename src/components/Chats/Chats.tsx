import "./Chats.css";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import ChatType from "../../types/chat.type";
import { getChatsRequest } from "../apiCalls/getChats.request";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import ChatsNavbar from "../ChatsNavbar/ChatsNavbar";
import { updateConversationRequest } from "../apiCalls/updateConversation.request";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import { getConversationsRequest } from "../apiCalls/getConverrsations.request";
import setConversations from "../../redux/actions/setConversations";

interface Props {
	showUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
	showGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const Chats: React.FC<Props> = ({ showUserInfo, showGroupInfo }) => {
	const dispatch = useDispatch();
	const selectedConversation = useSelector(
		(state: StateType) => state?.selectedConversation
	);
	const user = useSelector((state: StateType) => state?.userInfo);
	const messageEndRef = useRef<HTMLDivElement>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [chats, setChats] = useState<ChatType[]>([]);
	const [message, setMessage] = useState<string>("");
	const [messageLoading, setMessageLoading] = useState<boolean>(false);

	useEffect(() => {
		const getChats_ = async () => {
			await getChats();
		};
		getChats_();

		// eslint-disable-next-line
	}, [selectedConversation]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "end",
		});

		// eslint-disable-next-line
	}, [chats]);

	async function getChats() {
		setLoading(true);
		let chats: any;
		if (selectedConversation) {
			chats = await getChatsRequest(selectedConversation?._id as string);
			if (chats?.res) setChats(chats.res);
			else {
				toast.error(chats?.error, {
					autoClose: 5000,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
			}
		} else {
			setChats([])
		}
		setLoading(false);
	}

	async function sendMessage(message: string) {
		setMessageLoading(true);
		const result = await updateConversationRequest(
			selectedConversation?._id as string,
			message
		);
		if (result.error) {
			toast.error(result.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else {
			const conversation = result.res;
			dispatch(setSelectedConversation(conversation));
			getChats();
			const conversations = await getConversationsRequest();
			if (conversations.res) dispatch(setConversations(conversations.res));
			else
				toast.error(conversations.error, {
					autoClose: 5000,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
		}
		setMessage("");
		setMessageLoading(false);
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

	return (
		<div className="chats-container">
			{selectedConversation && user && (
				<ChatsNavbar
					selectedConversation={selectedConversation}
					user={user}
					showGroupInfo={showGroupInfo}
					showUserInfo={showUserInfo}
				/>
			)}
			{chats?.length === 0 && (
				<div className="empty-chats">
					<img
						src="/images/chat-background-empty.gif"
						alt="no-chats"
						height="50%"
						width="50%"
					/>
				</div>
			)}
			{chats?.length > 0 && (
				<div className="chats">
					{chats?.map((chat: ChatType, chatIndex: number) => {
						const chatDate = new Date(chat.updatedAt);
						if (chat.content === "")
							return <React.Fragment key={chat._id}></React.Fragment>;
						else if (chat.author._id === user?._id) {
							return (
								<div key={chat._id} className="chat-bubble sender">
									<span className="message">{chat.content}</span>
									<span> </span>
									<span className="time">
										{chatDate.toLocaleTimeString("en-US", {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</div>
							);
						} else {
							return (
								<React.Fragment key={chat._id}>
									{selectedConversation?.conversationName !== "" &&
										chats[chatIndex].author._id !== chats[chatIndex - 1]?.author._id &&
											(
												<div className="messager-info">
													<Avatar
														alt={chat.author.name}
														src={chat.author.pic}
														sx={{ width: 27, height: 27 }}
														style={{
															border: chat.author.online
																? "2px solid green"
																: "2px solid grey",
															marginRight: "5px",
															cursor: "pointer"
														}}
													/>
													<span style={{cursor: "pointer"}}>
														<b> {chat.author.name}</b>
													</span>
												</div>
										  )}
									<div className="chat-bubble receiver">
										<span className="message">{chat.content}</span>
										<span> </span>
										<span className="time">
											{chatDate.toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>
								</React.Fragment>
							);
						}
					})}
					<div className="bottom-scroll" ref={messageEndRef}></div>
				</div>
			)}
			{chats.length > 0 && (
				<div className="send-message">
					<input
						autoFocus
						type="text"
						placeholder="Type your message here"
						className="message"
						value={message}
						onKeyDown={(e) => {
							if (e.key === "Enter") sendMessage(message);
						}}
						onChange={(e) =>
							setMessage(e.currentTarget.value.toLowerCase().slice(0, 99))
						}
					></input>
					<span style={{ fontSize: "0.9rem", color: "grey" }}>
						{99 - message.length}
					</span>
					<div className="send" onClick={() => sendMessage(message)}>
						{!messageLoading && <i className="fa-solid fa-paper-plane"></i>}
						{messageLoading && (
							<div className="spinner-border text-dark" role="status"></div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Chats;
