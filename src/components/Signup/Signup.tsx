import "./Signup.css";
import React, { useEffect, useState } from "react";
import Logo from "../Home/Logo";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  
import "react-toastify/dist/ReactToastify.css"
import checkEmail from "./checkEmail";
import checkName from "./checkName";
import checkPassword from "./checkPassword";
import { signupRequest } from "../apiCalls/signup.request";

const Signup: React.FC = () => {
	const navigate: NavigateFunction = useNavigate();
	const [visible, setVisible] = useState<boolean>(true);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [picLink, setPickLink] = useState<string>(
		"https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1-744x744.jpg"
	);
	const [pic, setPic] = useState<string>("");
	const [show, setShow] = useState<boolean>(false);
	const [popover, setPopover] = useState<boolean>(false)
	const [popoverText, setPopoverText] = useState<string[]>([])
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
        if(localStorage.getItem("userInfo")){
			navigate("/chats")
		}

        // eslint-disable-next-line
    }, [navigate])

	async function createProfile() {
		if(loading) return
		setLoading(true)
		if(!await checkName(name)) {
			setLoading(false)
			return 
		}
		let picture: string = ""
		if (pic !== "") {
			const data = new FormData();
			data.append("file", pic);
			data.append("upload_preset", "chat-mate");
			data.append("cloud_name", "dkuihetfo");
			await fetch("https://api.cloudinary.com/v1_1/dkuihetfo/image/upload", {
				method: "post",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					picture = data.url.toString()
				})
				.catch(err => {
					toast.warning(err, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
					setLoading(false)
				})
		}
		else {
			picture = picLink
		}
		const res = await signupRequest(name, email, password, picture)
		if(res.error) {
			toast.error(res.error, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
		}
		else {
			toast.success(res.message, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
			localStorage.setItem("userInfo", JSON.stringify(res.res))
			navigate("/chats")
		}
		setLoading(false)
	}

	function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
		setPopoverText(checkPassword(e.currentTarget.value))
		setPassword(e.currentTarget.value);
	}

	function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.currentTarget.value.toLowerCase());
	}

	function handleName(e: React.ChangeEvent<HTMLInputElement>) {
		if(e.currentTarget.value.length <= 15) setName(e.currentTarget.value);
	}

	function handlePic(picture: any) {
		setLoading(true)
		if (picture[0] === undefined) {
			toast.warning("Please upload an image", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
		}
		else if(picture[0].type==="image/jpeg" || picture[0].type==="image/jpg" || picture[0].type==="image/png") {
			setPickLink(URL.createObjectURL(picture[0]));
			setPic(picture[0]);
		} else {
			toast.warning("Please upload only jpeg/jpg/png type image files", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
		}
		setLoading(false)
	}

	async function handleSignup() {
		if(loading) return
		setLoading(true)
		if(await checkEmail(email)){
			const res = checkPassword(password)
			if(res.length === 0) 
				setVisible(value => !value)
			else 
				setPopover(true)
		}
		setLoading(false)
	}

	return (
		<div className="home-container">
			<Logo />

			{visible && (
				<>
					<div className="login-container">
						<div className="login">
							<span>SIGN UP</span>
						</div>
						<div className="form-floating mb-3">
							<input
								type="text"
								className="form-control"
								placeholder="User ID"
								value={email}
								onChange={handleEmail}
							/>
							<label>Email ID</label>
						</div>
						<div className="form-floating">
							<input
								type={show ? "text" : "password"}
								className="form-control"
								placeholder="Create Password"
								value={password}
								onFocus={() => setPopover(true)}
								onBlur={() => setPopover(false)}
								onChange={handlePassword}
							/>
							{!show && (
								<i
									className="fa-solid fa-eye fa-xl eye"
									onClick={() => setShow((value) => !value)}
								></i>
							)}
							{show && (
								<i
									className="fa-solid fa-eye-slash fa-xl eye"
									onClick={() => setShow((value) => !value)}
								></i>
							)}
							{popover && 
								<div className="popover">
									{popoverText.map((text, index) => 
										<p className="popover-text" key={index}>{index+1}. {text}</p>
									)}
								</div>	
							}
							<label>Create Password</label>
						</div>
						<div className="new-user">
							<span>Already have an account? </span>
							<span>
								<Link className="link" to="/login">
									{" "}
									Sign in
								</Link>
							</span>
						</div>
						<div
							className="login-button"
							onClick={handleSignup}
						>	
							{loading && <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status"></div>}
							{!loading && "Create Profile"}
						</div>
					</div>
					<div className="home-button">
						<button
							className="btn btn-secondary btn-lg"
							onClick={() => navigate("/home")}
						>
							<img src="/images/home.png" alt="home" width="30%" height="30%" />
							<span> </span>
							HOME
						</button>
					</div>
				</>
			)}

			{!visible && (
				<>
					<div className="login-container">
						<div className="login">
							<span>SET UP YOUR CHAT PROFILE</span>
						</div>

						<div className="profile">
							<div
								className="profile-picture"
								style={{ backgroundImage: "url(" + picLink + ")" }}
							>
								<input
									type="file"
									accept="image/*"
									className="file-upload"
									onChange={(e) => handlePic(e.currentTarget.files)}
								/>
							</div>
							<div className="user-name">
								<input
									type="text"
									className="form-control"
									placeholder="User Name"
									value={name}
									onChange={handleName}
								/>
								<span className="position-absolute top-100 start-100 translate-middle badge bg-secondary">{15 - name.length}</span>
							</div>
						</div>

						<div className="login-button" onClick={createProfile}>
							{loading && <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status"></div>}
							{!loading && "Create Account"} 
						</div>
					</div>
					<div className="home-button">
						<button
							className="btn btn-secondary btn-lg"
							onClick={() => setVisible((value) => !value)}
						>
							<img src="/images/back.png" alt="home" width="20%" height="20%" />
							<span> </span>
							BACK
						</button>
					</div>
				</>
			)}	
		</div>
	);
};

export default Signup;
