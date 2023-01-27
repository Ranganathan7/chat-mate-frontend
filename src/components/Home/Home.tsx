import "./Home.css";
import React, { useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const Home: React.FC = () => {

    const navigate:NavigateFunction = useNavigate()

    useEffect(() => {
        if(localStorage.getItem("userInfo")){
			navigate("/chats")
		}

        // eslint-disable-next-line
    }, [navigate])

	return (
		<div className="home-container">
            <Logo />
            
			<div className="welcome-container">
				Welcome to Chat Mate, where connection and conversation come together!
				We're excited to have you join our community of friendly chatters.
				Wheter you're looking to make new friends, exchange ideas, or just pass
				the time, you're in the right place. So, grap a seat, introduce yourself
				and let's start chatting!
			</div>

            <div className="login">
                <button className="btn btn-success btn-lg" onClick={() => navigate("/login")}>
                    <img src="/images/login.png" alt="login" width="25%" height="25%"/>
                    <span> </span>
                    <span> LOGIN</span>
                </button>
            </div>

            <div className="signup">
            <button className="btn btn-warning btn-lg" onClick={() => navigate("/signup")}>
                <img src="/images/signup.png" alt="signup" width="25%" height="25%"/>
                <span> </span>
                <span> SIGN UP</span>
            </button>
            </div>
		</div>
	);
};

export default Home;
