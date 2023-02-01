import { toast } from "react-toastify";  
import axios from "axios"
import { endpoint } from "../apiCalls/ENDPOINT";

async function checkEmail(email: string): Promise<boolean> {
    if(!email) {
        toast.error("Please enter an Email", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        return false
    }
    const valid = /[a-z]+[a-z0-9.!#$%&'*+/=?^_`]+@+[a-z]+[.]+[a-z]/g
        if (email.match(valid)) {
            try {
                const response = await axios.post(
                    endpoint+"/chat-mate-api/email",
                    {
                        email: email
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
        else {
            toast.error("Please enter a valid Email like: (example777@domain.extension)", { autoClose: 5000, position: toast.POSITION.BOTTOM_RIGHT })
            return false
        }
}

export default checkEmail