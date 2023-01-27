import "./GroupInfo.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import setUserInfo from "../../redux/actions/setUserInfo";
import Avatar from "@mui/material/Avatar";
import { createPrivateConversationRequest } from "../apiCalls/createPrivateConversation.request";
import { toast } from "react-toastify";
import setSelectedConversation from "../../redux/actions/setSelectedConversation";
import UserType from "../../types/user.type";
import { getConversationsRequest } from "../apiCalls/getConverrsations.request";
import setConversations from "../../redux/actions/setConversations";
import { removeGroupMemberRequest } from "../apiCalls/removeGroupMember.request";
import removeSelectedConversation from "../../redux/actions/removeSelectedConversation";
import Tooltip from "@mui/material/Tooltip";
import { deleteGroupRequest } from "../apiCalls/deleteGroup.request";
import { editGroupPicRequest } from "../apiCalls/editGroupPic.request";
import { editGroupNameRequest } from "../apiCalls/editGroupName.request";

interface Props {
	showGroupInfo: React.Dispatch<React.SetStateAction<boolean>>;
	showUserInfo: React.Dispatch<React.SetStateAction<boolean>>;
	showEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
	loading: boolean;
	setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupInfo: React.FC<Props> = ({
	showGroupInfo,
	showUserInfo,
	showEditProfile,
	loading,
	setLoading,
}) => {
	const conversation = useSelector(
		(state: StateType) => state?.selectedConversation
	);
	const loggedUser = useSelector((state: StateType) => state?.userInfo);
	const dispatch = useDispatch();
    const [name, setName] = useState<string>(conversation?.conversationName as string)
	const [showAddGroupMember, setShowAddGroupMember] = useState<boolean>(false);
    const [enableEditing, setEnableEditing] = useState<boolean>(false)

	useEffect(() => {
		if (conversation?.conversationName === "") showUserInfo(true);
		else showUserInfo(false);

		// eslint-disable-next-line
	}, [conversation]);

	function getCreatedDate(createdAt: Date): string {
		const date = new Date(createdAt);
		return date.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
		});
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
			dispatch(setSelectedConversation(result.res));
		}
		setLoading(false);
	}

	async function leaveGroup() {
		showGroupInfo(false);
		const updatedConversation = await removeGroupMemberRequest(
			conversation?._id as string,
			loggedUser?._id as string,
			"LEFT THE GROUP"
		);
		if (updatedConversation.error) {
			toast.error(updatedConversation.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
		dispatch(removeSelectedConversation());
		getConversations();
	}

	async function removeMember(user: UserType) {
		const updatedConversation = await removeGroupMemberRequest(
			conversation?._id as string,
			user._id as string,
			"REMOVED: " + user.name + " FROM GROUP"
		);
		if (updatedConversation.error) {
			toast.error(updatedConversation.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
		dispatch(setSelectedConversation(updatedConversation.res));
		getConversations();
	}

	async function deleteGroup() {
		const updatedConversation = await deleteGroupRequest(
			conversation?._id as string
		);
		if (updatedConversation.error) {
			toast.error(updatedConversation.error, {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
		dispatch(removeSelectedConversation());
		showGroupInfo(false);
		getConversations();
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
					const updatedConversation = await editGroupPicRequest(
						conversation?._id as string,
						data.url.toString(),
						"CHANGED GROUP PICTURE"
					);
					toast.success(updatedConversation.message, {
						autoClose: 5000,
						position: toast.POSITION.BOTTOM_RIGHT,
					});
					getConversations();
					dispatch(setSelectedConversation(updatedConversation.res));
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

    async function changeGroupName() {
        const updatedConversation = await editGroupNameRequest(
            conversation?._id as string,
            name,
            "CHANGED GROUP NAME"
        );
        toast.success(updatedConversation.message, {
            autoClose: 5000,
            position: toast.POSITION.BOTTOM_RIGHT,
        });
        getConversations();
        dispatch(setSelectedConversation(updatedConversation.res));
    }

	return (
		<div className="group-info">
			<div className="close-info" onClick={() => showGroupInfo(false)}>
				<i className="fa-solid fa-xmark"></i>
			</div>
			<div className="group-pic">
				<Avatar
					alt={conversation?.conversationName}
					src={conversation?.conversationPic}
					sx={{ width: 150, height: 150 }}
					style={{ border: "2px solid black" }}
				/>
				{!loading && conversation?.admins[0]._id === loggedUser?._id && <div className="edit-pic">
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
					<br />
					CHANGE PROFILE PHOTO
				</div>}
			</div>
			<div className="group-created">
				{"Group created on " + getCreatedDate(conversation?.createdAt as Date)}
			</div>
			<div className="group-name">
                {conversation?.admins[0]._id !== loggedUser?._id && conversation?.conversationName}
                {conversation?.admins[0]._id === loggedUser?._id && <>
                    <input className="group-name-input" type="text" value={name} onChange={(e) => {if(e.currentTarget.value.length <= 15) setName(e.currentTarget.value)}} />
                    <span className="position-absolute top-50 start-0 translate-middle badge bg-secondary">
						{15 - name.length}
					</span>
                </>}
                {" "}
                {name !== conversation?.conversationName && 
                    <Tooltip title="change group name">
                        <i className="fa-solid fa-md fa-floppy-disk save" onClick={changeGroupName}></i>
                    </Tooltip>
                }
            </div>
			<div className="group-members-title">
				{conversation?.users.length + " participants"}
			</div>
			{loggedUser?._id === conversation?.admins[0]._id && (
				<div className="add-member" onClick={() => setShowAddGroupMember(true)}>
					<i className="fa-solid fa-lg fa-user-plus"></i> Add participant
				</div>
			)}
			<div className="group-members">
				<div className="group-member" onClick={() => showEditProfile(true)}>
					<Avatar
						alt={loggedUser?.name}
						src={loggedUser?.pic}
						sx={{ width: 30, height: 30 }}
						className="group-member-pic"
					/>
					<span className="group-member-name">You</span>
					{conversation?.admins[0]._id === loggedUser?._id && (
						<span
							style={{
								marginLeft: "auto",
								fontWeight: "700",
								fontSize: "0.8rem",
							}}
						>
							~admin
						</span>
					)}
				</div>
				{conversation?.users.map((user: UserType) => {
					if (user._id === loggedUser?._id)
						return <React.Fragment key={user._id}></React.Fragment>;
					return (
						<div key={user._id} className="group-member">
							{loggedUser?._id === conversation?.admins[0]._id && (
								<Tooltip title="Remove User">
									<i
										className="fa-solid fa-user-slash remove-member"
										onClick={() => removeMember(user)}
									></i>
								</Tooltip>
							)}
							<Avatar
								alt={user.name}
								src={user.pic}
								sx={{ width: 30, height: 30 }}
								className="group-member-pic"
								onClick={() => createPrivateConversation(user._id)}
							/>
							<span
								className="group-member-name"
								onClick={() => createPrivateConversation(user._id)}
							>
								{user.name}
							</span>
							{conversation?.admins[0]._id === user._id && (
								<span
									style={{
										marginLeft: "auto",
										fontWeight: "700",
										fontSize: "0.8rem",
									}}
								>
									~admin
								</span>
							)}
						</div>
					);
				})}
			</div>
			{!loading && conversation?.admins[0]._id === loggedUser?._id && (
				<div className="leave-group" onClick={() => deleteGroup()}>
					<i className="fa-solid fa-lg fa-trash-can"></i> Delete Group
				</div>
			)}
			{!loading && conversation?.admins[0]._id !== loggedUser?._id && (
				<div className="leave-group" onClick={() => leaveGroup()}>
					<i className="fa-solid fa-lg fa-right-from-bracket"></i> Leave Group
				</div>
			)}
			{loading && (
				<div className="spinner-border text-dark" role="status"></div>
			)}
		</div>
	);
};

export default GroupInfo;
