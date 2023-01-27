import "./SearchUser.css";
import React, { useEffect, useState } from "react";
import UserType from "../../types/user.type";
import { searchUsersRequest } from "../apiCalls/searchUsers.request";
import { toast } from "react-toastify";
import { createPrivateConversationRequest } from "../apiCalls/createPrivateConversation.request";
import { useDispatch } from "react-redux";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import Avatar from "@mui/material/Avatar";

interface Props {
	setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchUser: React.FC<Props> = ({ setShowSearch }) => {
	const [search, setSearch] = useState<string>("");
	const [users, setUsers] = useState<UserType[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [searching, setSearching] = useState<boolean>(false);
	const dispatch = useDispatch();

	useEffect(() => {
		getUsers(search);

		// eslint-disable-next-line
	}, [search]);

	async function getUsers(name: string) {
		setSearching(true);
		const result = await searchUsersRequest(name);
		if (result.error) {
			toast.error(result.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else setUsers(result.res);
		setSearching(false);
	}

	async function createPrivateConversation(userId: string) {
		setLoading(true);
		const result = await createPrivateConversationRequest(userId);
		if (result.error) {
			toast.error(result.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else {
			const conversation = result.res;
			dispatch(setSelectedConversation(conversation));
			setShowSearch(false);
		}
		setLoading(false);
	}

	if (loading) {
		return (
			<div className="creating-conversation">
				<div className="spinner-grow text-primary" role="status"></div>
				<div className="spinner-grow text-secondary" role="status"></div>
				<div className="spinner-grow text-success" role="status"></div>
				<div className="spinner-grow text-danger" role="status"></div>
				<div className="spinner-grow text-warning" role="status"></div>
				<div className="spinner-grow text-info" role="status"></div>
				<div className="spinner-grow text-dark" role="status"></div>
			</div>
		);
	}

	return (
		<div className="search-users">
			<div className="search">
				<input
					className="search-input"
					type="text"
					value={search}
					onChange={(e) => setSearch(e.currentTarget.value)}
					placeholder="Search / Start new Chat"
				></input>
				{searching && (
					<div
						className="spinner-border text-info searching"
						role="status"
					></div>
				)}
			</div>
			<div className="users">
				{users?.map((user: UserType) => (
					<div
						className="user"
						onClick={() => createPrivateConversation(user._id)}
						key={user._id}
					>
                        <div className="profile">
						    <Avatar
							    alt={user?.name}
							    src={user?.pic}
							    sx={{ width: 30, height: 30 }}
							    className="pic"
						    />
                        </div>
						<div className="name">{user.name}</div>
						<div className="online" style={{color: user.online?"green":"red"}}>{user.online ? "ONLINE" : "OFFLINE"}</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default SearchUser;
