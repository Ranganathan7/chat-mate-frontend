import "./AddGroupMember.css";
import React, { useEffect, useState } from "react";
import ConversationType from "../../types/conversation.type";
import { useDispatch } from "react-redux";
import UserType from "../../types/user.type";
import { searchUsersRequest } from "../apiCalls/searchUsers.request";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import { addGroupMemberRequest } from "../apiCalls/addGroupMember.request";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import { getConversationsRequest } from "../apiCalls/getConverrsations.request";
import setConversations from "../../redux/actions/setConversations";
import { Socket } from "socket.io-client";

interface Props {
	setShowAddGroupMember: React.Dispatch<React.SetStateAction<boolean>>;
	conversation: ConversationType;
	socket: Socket | undefined
}

const AddGroupMember: React.FC<Props> = ({
	setShowAddGroupMember,
	conversation,
	socket
}) => {
	const [search, setSearch] = useState<string>("");
	const [users, setUsers] = useState<UserType[]>([]);
	const [searching, setSearching] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	useEffect(() => {
		getUsers(search);

		// eslint-disable-next-line
	}, [search]);

    async function addMember(user: UserType) {
		setLoading(true)
		const updatedConversation = await addGroupMemberRequest(
			conversation?._id as string,
			user._id as string,
			"ADDED: " + user.name + " TO GROUP"
		);
		if (updatedConversation.error) {
			toast.error(updatedConversation.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
		setShowAddGroupMember(true)
        socket?.emit("newMessage", {conversationId: conversation?._id})
		setLoading(false);
	}

	async function getUsers(name: string) {
		setSearching(true);
		const result: any = await searchUsersRequest(name);
		if (result.error) {
			toast.error(result.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else setUsers(result.res);
		setSearching(false);
	}

    function isAlreadyMember(user: UserType) {
        let res = false
        conversation.users.map((member: UserType) => {
            if(member._id === user._id) res = true;
        })
        return res
    }

	return (
		<div className="add-group-member-container">
			<div className="go-back">
				<i
					className="fa-solid fa-arrow-left back"
					onClick={() => setShowAddGroupMember(false)}
				></i>
				<span className="text">Add New Members</span>
			</div>
			<div className="search-users">
				<div className="search">
					<input
						className="search-input"
						type="text"
						value={search}
						onChange={(e) => setSearch(e.currentTarget.value)}
						placeholder="Search / Add Member"
					></input>
					{searching && (
						<div
							className="spinner-border text-info searching"
							role="status"
						></div>
					)}
				</div>
				<div className="users">
					{users?.map((user: UserType) => {
                        if(isAlreadyMember(user)) return <React.Fragment key={user._id}></React.Fragment>
                        else return (
						<div className="user" key={user._id} onClick={() => addMember(user)}>
							<div className="profile">
								<Avatar
									alt={user?.name}
									src={user?.pic}
									sx={{ width: 30, height: 30 }}
									className="pic"
								/>
							</div>
							<div className="name">{user.name}</div>
							<div className="online">
                                <i className="fa-solid fa-xl fa-user-plus"></i>
							</div>
						</div>)
                    })}
				</div>
			</div>
		</div>
	);
};

export default AddGroupMember;
