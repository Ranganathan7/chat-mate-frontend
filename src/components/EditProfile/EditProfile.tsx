import "./EditProfile.css";
import React, { useState } from "react";
import StateType from "../../types/state.type";
import { useDispatch, useSelector } from "react-redux";
import UserType from "../../types/user.type";
import Avatar from "@mui/material/Avatar";
import { editProfileRequest } from "../apiCalls/editProfile.request";
import setUserInfo from "../../redux/actions/setUserInfo";
import { toast } from "react-toastify";
import Tooltip from "@mui/material/Tooltip";
import checkName from "../Signup/checkName";

const EditProfile: React.FC = () => {
	const user = useSelector((state: StateType) => state?.userInfo);
	const [editedName, setEditedName] = useState<string>(user?.name as string);
	const [enableEditing, setEnableEditing] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch();

	async function changeName(name: string) {
		if (name === user?.name) {
			toast.info("Existing name is same as edited name", {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
			return;
		}
		if (!(await checkName(name))) {
			return;
		}
		if (!loading) {
			setLoading(true);
			const updatedUser = await editProfileRequest(name, "", true);
			if (updatedUser.error) {
				toast.error(updatedUser.error, {
					autoClose: 5000,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
			} else {
				toast.success(updatedUser.message, {
					autoClose: 5000,
					position: toast.POSITION.BOTTOM_RIGHT,
				});
				localStorage.setItem("userInfo", JSON.stringify(updatedUser.res));
				dispatch(setUserInfo(JSON.stringify(updatedUser.res)));
			}
			setLoading(false);
		}
		setEnableEditing(false);
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
                    const updatedUser = await editProfileRequest("", data.url.toString(), true)
                    toast.success(updatedUser.message, {
                        autoClose: 5000,
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                    dispatch(setUserInfo(JSON.stringify(updatedUser.res)));
				})
				.catch(err => {
					toast.warning(err, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
					setLoading(false)
				})
		} else {
			toast.warning("Please upload only jpeg/jpg/png type image files", {
				autoClose: 5000,
				position: toast.POSITION.BOTTOM_RIGHT,
			});
		}
		setLoading(false);
	}

	return (
		<div className="edit-profile">
			<div className="profile-pic">
				<Avatar
					alt={user?.name}
					src={user?.pic}
					sx={{ width: 150, height: 150 }}
					className="pic"
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
					<br />
					CHANGE PROFILE PHOTO
				</div>
			</div>
			<div className="user-name">
				<div className="name-input">
					{!enableEditing && (
						<input
							type="text"
							className="form-control"
							placeholder="User Name"
							value={user?.name}
							readOnly
						/>
					)}
					{enableEditing && (
						<input
							type="text"
							className="form-control"
							placeholder="User Name"
							value={editedName}
							onChange={(e) => {
								if (e.currentTarget.value.length <= 15)
									setEditedName(e.currentTarget.value);
							}}
						/>
					)}
					{enableEditing && (
						<span className="position-absolute top-100 start-100 translate-middle badge bg-secondary">
							{15 - editedName.length}
						</span>
					)}
				</div>
				{!enableEditing && (
					<Tooltip title="Edit Your Name">
						<div
							className="edit-button"
							onClick={() => {
								setEnableEditing(true);
								setEditedName(user?.name as string);
							}}
						>
							<i className="fa-solid fa-xl fa-pen-to-square"></i>
						</div>
					</Tooltip>
				)}
				{enableEditing && (
					<Tooltip title="Save Changes">
						<div className="save-button" onClick={() => changeName(editedName)}>
							<i className="fa-solid fa-xl fa-floppy-disk"></i>
						</div>
					</Tooltip>
				)}
				{enableEditing && (
					<Tooltip title="Cancel Changes">
						<div
							className="edit-button"
							onClick={() => setEnableEditing(false)}
						>
							<i className="fa-solid fa-xl fa-ban"></i>
						</div>
					</Tooltip>
				)}
			</div>
			<div className="user-name">
				<Tooltip title={user?.email}>
					<div className="name-input">
						{user?.email.slice(0, 15)}
						<b>{(user?.email?.length as number) > 15 ? "....." : ""}</b>
					</div>
				</Tooltip>
				<Tooltip title="Email can't be edited">
					<div className="edit-button">
						<i className="fa-solid fa-xl fa-asterisk"></i>
					</div>
				</Tooltip>
			</div>
			{loading && (
				<div className="saving">
					<div className="spinner-grow text-primary" role="status"></div>
					<div className="spinner-grow text-secondary" role="status"></div>
					<div className="spinner-grow text-success" role="status"></div>
					<div className="spinner-grow text-danger" role="status"></div>
					<div className="spinner-grow text-warning" role="status"></div>
					<div className="spinner-grow text-info" role="status"></div>
				</div>
			)}
		</div>
	);
};

export default EditProfile;
