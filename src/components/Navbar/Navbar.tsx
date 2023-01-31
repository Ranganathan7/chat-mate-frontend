import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Socket } from "socket.io-client";
import clearStore from "../../redux/actions/clearStore";
import { editProfileRequest } from "../apiCalls/editProfile.request";
import { logoutRequest } from "../apiCalls/logout.request";
import "./Navbar.css";

interface Props {
    socket: Socket | undefined
}

const Navbar: React.FC<Props> = ({socket}) => {

    const [show, setShow] = useState<boolean>(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function logout() {
        await editProfileRequest("", "", false)
        socket?.emit("userOnline")
        const res = await logoutRequest()
        if(res.error) {
            toast.error(res.error, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        }
        else {
            toast.success(res.message, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        }
        localStorage.clear()
        dispatch(clearStore())
        navigate("/home")
    }
    
	return (
		<div className="navbar-container">
            <div className="image-container">
			    <img
				src="/images/chat-mate-logo.png"
				alt="Logo"
				width="100%"
				height="100%"
				className="d-inline-block align-text-top"
			    />
            </div>
            <div className="chat-mate">
                <span className="chat-mate-text">C</span>
                <span className="chat-mate-text">h</span>
                <span className="chat-mate-text">a</span>
                <span className="chat-mate-text">t</span>
                <span className="chat-mate-text">-</span>
                <span className="chat-mate-text">M</span>
                <span className="chat-mate-text">a</span>
                <span className="chat-mate-text">t</span>
                <span className="chat-mate-text">e</span>
            </div>
            <div className="logout">
                <button 
                    className="btn btn-danger" 
                    onMouseEnter={() => setShow(true)} 
                    onMouseLeave={() => setShow(false)}
                    onClick = {logout}
                >
                    <i className="fa-solid fa-xl fa-right-from-bracket"></i>
                    {show && " logout"}
                    </button>
            </div>
		</div>
	);
};

export default Navbar;
