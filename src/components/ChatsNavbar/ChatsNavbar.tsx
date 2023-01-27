import "./ChatsNavbar.css";
import ConversationType from "../../types/conversation.type";
import Avatar from "@mui/material/Avatar";
import UserType from "../../types/user.type";

interface Props {
	selectedConversation: ConversationType;
	user: UserType;
	showUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
	showGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatsNavbar: React.FC<Props> = ({
	selectedConversation,
	user,
	showUserInfo,
	showGroupInfo,
}) => {
	const conversation = Object.create(selectedConversation);

	function getLastOnline(lastOnline: Date): string {
		const date = new Date(lastOnline)
		return date.toLocaleDateString() + ", " + date.toLocaleTimeString()
	}

	if (!conversation) {
		return <></>;
	} else if (conversation?.conversationName !== "") {
		return (
			<div className="chats-navbar">
				<div className="pic" onClick={() => showGroupInfo(true)}>
					<Avatar
						alt={conversation?.conversationName}
						src={conversation?.conversationPic}
					/>
				</div>
				<div className="info" onClick={() => showGroupInfo(true)}>
					<p className="title">{conversation?.conversationName}</p>
					<p className="message">
						{conversation?.users.map((member: UserType, index: number) => {
							if (index !== conversation?.users.length - 1)
								if(member.name === user.name) return "You, " 
								else return member.name + ", ";
							else {
								if(member.name === user.name) return "You" 
								else return member.name;
							}
						})}
					</p>
				</div>
				<div className="info-button" onClick={() => showGroupInfo(true)}>
					<i className="fa-solid fa-circle-info"></i>
				</div>
			</div>
		);
	} else {
		return (
			<div className="chats-navbar">
				{conversation?.users[0]._id !== user?._id && (
					<>
						<div className="pic" onClick={() => showUserInfo(true)}>
							<Avatar
								alt={conversation?.users[0].name}
								src={conversation?.users[0].pic}
							/>
						</div>
						<div className="info" onClick={() => showUserInfo(true)}>
							<p className="title">{conversation.users[0].name}</p>
							<p className="message">
								{conversation?.users[0].online && "ONLINE"}
								{!conversation?.users[0].online &&
									"Last seen at " + getLastOnline(conversation.users[0].lastOnline)}
							</p>
						</div>
						<div className="info-button" onClick={() => showUserInfo(true)}>
							<i className="fa-solid fa-circle-info"></i>
						</div>
					</>
				)}
				{conversation?.users[1]._id !== user?._id && (
					<>
						<div className="pic" onClick={() => showUserInfo(true)}>
							<Avatar
								alt={conversation?.users[1].name}
								src={conversation?.users[1].pic}
							/>
						</div>
						<div className="info" onClick={() => showUserInfo(true)}>
							<p className="title">{conversation.users[1].name}</p>
							<p className="message">
								{conversation?.users[1].online && "ONLINE"}
								{!conversation?.users[1].online &&
									"Last seen at " + getLastOnline(conversation.users[1].lastOnline)}
							</p>
						</div>
						<div className="info-button" onClick={() => showUserInfo(true)}>
							<i className="fa-solid fa-circle-info"></i>
						</div>
					</>
				)}
			</div>
		);
	}
};

export default ChatsNavbar;
