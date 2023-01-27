import "./Login.css";
import React, { useEffect, useState } from "react";
import Logo from "../Home/Logo";
import { Link, NavigateFunction, useNavigate } from "react-router-dom";
import { loginRequest } from "../apiCalls/login.request";
import { toast } from "react-toastify";

const Login: React.FC = () => {
	const navigate: NavigateFunction = useNavigate();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("")
	const [show, setShow] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
        if(localStorage.getItem("userInfo")){
			navigate("/chats")
		}

        // eslint-disable-next-line
    }, [navigate])

	async function login() {
		if(loading) return
		setLoading(true)
		if(email==="" || password==="") {
			toast.info("Please fill the required fields (email & password)", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
			setLoading(false)
			return
		}
		const res = await loginRequest(email, password)
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

	function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
		setEmail(e.currentTarget.value)
	}

	function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
		setPassword(e.currentTarget.value)
	}	

	return (
		<div className="home-container">
			<Logo />
			<div className="login-container">
				<div className="login">
					<span>SIGN IN</span>
				</div>
				<div className="form-floating mb-3">
					<input
						type="text"
						className="form-control"
						placeholder="Email ID"
						value={email}
						onChange={handleEmail}
					/>
					<label>Email ID</label>
				</div>
				<div className="form-floating">
					<input
						type={show ? "text" : "password"}
						className="form-control"
						placeholder="Password"
						value={password}
						onChange={handlePassword}
					/>
					{!show && <i className="fa-solid fa-eye fa-xl eye" onClick={()=>setShow(value => !value)}></i>}
					{show && <i className="fa-solid fa-eye-slash fa-xl eye" onClick={()=>setShow(value => !value)}></i>}
					<label>Password</label>
				</div>
				<div className="new-user">
					<span>First time chatting? </span>
					<span>
						<Link className="link" to="/signup">
							{" "}
							Set up your account
						</Link>
					</span>
				</div>
				<div className="login-button" onClick={login}>
					{loading && <div className="spinner-border" style={{width: "3rem", height: "3rem"}} role="status"></div>}
					{!loading && "Start Chatting"}
				</div>
			</div>
			<div className="home-button">
				<button
					className="btn btn-secondary btn-md"
					onClick={() => navigate("/home")}
				>
					<img src="/images/home.png" alt="home" width="30%" height="30%" />
					<span> </span>
					HOME
				</button>
			</div>
		</div>
	);
};

export default Login;
