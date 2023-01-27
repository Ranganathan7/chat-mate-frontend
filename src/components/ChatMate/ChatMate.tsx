import "./ChatMate.css";
import React, { useState } from "react";
import TypeWriter from "../TypeWriter/TypeWriter";
import { Link } from "react-router-dom";

const ChatMate: React.FC = () => {
	const [visiblility, setVisibility] = useState<string>("");
	const [background, setBackground] = useState<string>("background");
	const [button, setButton] = useState<string>("/images/home-chat-button.png");

	function visible() {
		setVisibility("");
		setBackground("");
	}

	function invisible() {
		setVisibility("hidden");
		setBackground("background");
	}

	function defaultButton() {
		setButton("/images/home-chat-button.png");
	}

	function changeButton() {
		setButton("/images/home-chat-button-hovered.png");
	}

	return (
		<div className={"chat-mate-container " + background}>
			<div className="image-1">
				<img
					className={visiblility}
					src="/images/chatting-1.gif"
					alt="chatting-1"
				/>
			</div>
			<div className="image-2">
				<img
					className={visiblility}
					src="/images/chatting-2.gif"
					alt="chatting-2"
					height="80%"
					width="65%"
				/>
			</div>
			<div className="content-container">
				<div
					className="logo-container"
					onMouseEnter={visible}
					onMouseLeave={invisible}
				>
					<div className="chat-mate-text">
						<TypeWriter
							content={[
								"Join the conversation on Chat Mate! We're glad you're here!",
								"Chat Mate is happy to have you here! Let's get chatting!",
								"Chat Mate is the perfect place to connect with others. Welcome!",
								"Welcome to Chat Mate, where the conversation never ends!",
							]}
							delay="100"
							wait="1000"
							cursor="|"
						/>
					</div>
					<img
						className="home-logo"
						src="/images/home-logo.png"
						alt="home-logo"
						height="90%"
						width="80%"
					/>
					<Link to="/home" style={{ color: "black" }}>
						<div
							className="chat-mate-button"
							onMouseEnter={changeButton}
							onMouseLeave={defaultButton}
						>
							<img src={button} alt="chat-button" height="120%" width="120%" />
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ChatMate;
