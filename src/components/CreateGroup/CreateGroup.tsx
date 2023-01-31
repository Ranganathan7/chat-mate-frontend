import "./CreateGroup.css";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import { createGroupConversationRequest } from "../apiCalls/createGroupConversation.request";
import UserType from "../../types/user.type";
import { getConversationsRequest } from "../apiCalls/getConverrsations.request";
import setConversations from "../../redux/actions/setConversations";
import { useDispatch } from "react-redux";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import { searchUsersRequest } from "../apiCalls/searchUsers.request";
import { Socket } from "socket.io-client";

interface Props {
    setShowCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
	socket: Socket | undefined
}

const CreateGroup: React.FC<Props> = ({ setShowCreateGroup, socket }) => {
	const [pic, setPic] = useState<string>(
		"https://i.pinimg.com/originals/cf/f3/58/cff3584f65cf4fe72c9591500a7c5c8f.jpg"
	);
	const [loading, setLoading] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [members, setMembers] = useState<UserType[]>([]);
	const [users, setUsers] = useState<UserType[]>([]);
	const [search, setSearch] = useState<string>("");
	const [searching, setSearching] = useState<boolean>(false);
	const dispatch = useDispatch();

	useEffect(() => {
		setPic(
			"https://i.pinimg.com/originals/cf/f3/58/cff3584f65cf4fe72c9591500a7c5c8f.jpg"
		);
		setName("");
		setMembers([]);
		setSearch("");
		getUsers(search);

		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		getUsers(search);

		// eslint-disable-next-line
	}, [search]);

	async function handlePic(picture: any) {
		setLoading(true);
		if (picture[0] === undefined) {
			toast.warning("Please upload an image", {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else if (
			picture[0].type === "image/jpeg" ||
			picture[0].type === "image/jpg" ||
			picture[0].type === "image/png"
		) {
			const data = new FormData();
			data.append("file", picture[0]);
			data.append("upload_preset", "chat-mate");
			data.append("cloud_name", "dkuihetfo");
			await fetch("https://api.cloudinary.com/v1_1/dkuihetfo/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then(async (data) => {
					setPic(data.url.toString());
				})
				.catch((err) => {
					toast.warning(err, {
						autoClose: 5000,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
					setLoading(false);
				});
		} else {
			toast.warning("Please upload only jpeg/jpg/png type image files", {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
		setLoading(false);
	}

	function addMember(user: UserType) {
		setMembers((members) => [...members, user]);
	}

	function removeMember(user: UserType) {
		setMembers((members) =>
			members.filter((member: UserType) => member._id !== user._id)
		);
	}

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

	async function createGroupConversation() {
		setLoading(true);
		if (name.length === 0) {
			toast.info("Please enter the Group Name!", {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else if (members.length < 2) {
			toast.info("To create a Group add atleast two users to it!", {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		} else {
			let message =
				"CREATED THE GROUP AND ADDED: "
				members.map((user: UserType, index: number) => {
					if (index < members.length - 1) message = message + user.name + ", ";
					else message = message + user.name;
				});
			const userIds = members.map((user: UserType) => user._id);
			const groupConversation = await createGroupConversationRequest(
				userIds,
				name,
				pic,
				message
			);
			if (groupConversation.error) {
				toast.error(groupConversation.error, {
					autoClose: 5000,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
			} else {
				toast.success("Created Group Successfully!", {
					autoClose: 5000,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
                setShowCreateGroup(false)
				socket?.emit("newGroup", {conversationId: groupConversation.res._id})
				dispatch(setSelectedConversation(groupConversation.res));
			}
		}
		setLoading(false);
	}

	async function getConversations() {
		const conversations = await getConversationsRequest();
		if (conversations.res) dispatch(setConversations(conversations.res));
		else
			toast.error(conversations.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
	}

	function isAlreadyAdded(user: UserType) {
		let res = false;
		members.map((member: UserType) => {
			if (member._id === user._id) res = true;
		});
		return res;
	}

	return (
		<div className="create-group">
			<div className="group-name-pic">
				<div className="pic">
					<Avatar
						alt="default-group-icon"
						src={pic}
						sx={{ width: 100, height: 100 }}
						style={{ border: "1px solid black" }}
					/>
					<div className="edit-pic">
						<input
							type="file"
							accept="image/*"
							className="edit-pic-file"
							onChange={(e) => handlePic(e.currentTarget.files)}
							title=""
						/>
						<br />
						<i className="fa-solid fa-camera fa-2xl"></i>
						<br />
						CHANGE
					</div>
				</div>
				<div className="name">
					<input
						className="group-name-input"
						type="text"
						value={name}
						onChange={(e) => {
							if (e.currentTarget.value.length <= 15)
								setName(e.currentTarget.value);
						}}
						placeholder="Group Name"
					/>
					<span className="position-absolute top-50 start-100 translate-middle badge bg-secondary">
						{15 - name.length}
					</span>
				</div>
			</div>
			<div className="added-members">
				{members.map((member: UserType) => {
					return (
						<div className="member" key={member._id}>
							{member.name}{" "}
							<i
								className="fa-solid fa-xmark remove"
								onClick={() => removeMember(member)}
							></i>
						</div>
					);
				})}
			</div>
			<div className="add-member">
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
							if (isAlreadyAdded(user))
								return <React.Fragment key={user._id}></React.Fragment>;
							else
								return (
									<div
										className="user"
										key={user._id}
										onClick={() => addMember(user)}
									>
										<div className="profile">
											<Avatar
												alt={user?.name}
												src={user?.pic}
												sx={{ width: 30, height: 30 }}
											/>
										</div>
										<div className="name">{user.name}</div>
										<div className="add" style={{ marginLeft: "auto" }}>
											<i className="fa-solid fa-lg fa-user-plus"></i>
										</div>
									</div>
								);
						})}
					</div>
				</div>
			</div>
			{loading && (
				<div className="create-group-button">
					<div
						className="spinner-border text-dark searching"
						role="status"
					></div>
				</div>
			)}
			{!loading && (
				<div className="create-group-button" onClick={createGroupConversation}>
					<i className="fa-solid fa-people-group"></i> Create Group
				</div>
			)}
		</div>
	);
};

export default CreateGroup;
