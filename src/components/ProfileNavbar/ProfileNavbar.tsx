import "./ProfileNavbar.css";
import React, { useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import StateType from "../../types/state.type";
import setUserInfo from "../../redux/actions/setUserInfo";
import Tooltip from "@mui/material/Tooltip";

interface Props {
	showSearch: boolean;
	setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
	showEditProfile: boolean;
	setShowEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
	showCreateGroup: boolean;
	setShowCreateGroup: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileNavbar: React.FC<Props> = ({
	showSearch,
	setShowSearch,
	showEditProfile,
	setShowEditProfile,
	showCreateGroup,
	setShowCreateGroup,
}) => {
	const user = useSelector((state: StateType) => state?.userInfo);
	const dispatch = useDispatch();

	if (showSearch || showCreateGroup || showEditProfile)
		return (
			<div className="profile-navbar row">
				<div
					className="back col-3"
					onClick={() => {
						setShowCreateGroup(false);
						setShowEditProfile(false);
						setShowSearch(false);
					}}
				>
					<i className="fa-solid fa-arrow-left"></i>
				</div>
				<div className="title col">
					{showSearch && "Search User"}
					{showEditProfile && "Edit Your Profile"}
					{showCreateGroup && "Create a new Group"}
				</div>
			</div>
		);
	else
		return (
			<div className="profile-navbar row">
				<div
					className="user-profile col-2 position-relative"
					onClick={() => setShowEditProfile(true)}
				>
					<Tooltip title="Edit Profile">
						<Avatar className="pic" alt={user?.name} src={user?.pic} />
					</Tooltip>
				</div>

				<div
					className="user-info col-6"
					onClick={() => setShowEditProfile(true)}
				>
					<Tooltip title="Edit Profile">
						<p className="user-name">{user?.name}</p>
					</Tooltip>
				</div>

				<div className="search-user col-2" onClick={() => setShowSearch(true)}>
					<Tooltip title="Search User / Start new Conversation">
						<i className="fa-solid fa-magnifying-glass"></i>
					</Tooltip>
				</div>
				<div
					className="new-group col-2"
					onClick={() => setShowCreateGroup(true)}
				>
					<Tooltip title="Create new Group">
						<i className="fa-solid fa-people-group"></i>
					</Tooltip>
				</div>
			</div>
		);
};

export default ProfileNavbar;
