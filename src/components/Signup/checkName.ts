import { toast } from "react-toastify";  
import axios from "axios"
import { endpoint } from "../apiCalls/ENDPOINT";

async function checkName(name: string) {
    if(!name) {
        toast.error("Please enter an User Name", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        return false
    }
    try {
        const response = await axios.post(
            endpoint+"/chat-mate-api/name",
            {
                name: name
            },
            {
                withCredentials: true
            }
        )
        if(response.data.message === "available") return true
        else {
            toast.error(response.data.message, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
            return false
        }
    } catch (error: any) {
        if(error.response.data.message) toast.error(error.response.data.message, { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        else toast.error("Error while communicating to server", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        return false
    }
}

export default checkName