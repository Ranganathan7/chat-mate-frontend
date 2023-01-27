import "./Home.css";
import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
	return (
		<Link className="link" to="/">
			<div className="logo-container">
				<img
					className="chat-mate-logo"
					src="/images/chat-mate-logo.png"
					alt="chat-mate-logo"
				/>
				<span>
					<span className="chat-mate">C</span>
					<span className="chat-mate">H</span>
					<span className="chat-mate">A</span>
					<span className="chat-mate">T</span>
					<span className="chat-mate"> </span>
					<span className="chat-mate">M</span>
					<span className="chat-mate">A</span>
					<span className="chat-mate">T</span>
					<span className="chat-mate">E</span>
					<span className="cursor">|</span>
				</span>
			</div>
		</Link>
	);
};

export default Logo;
