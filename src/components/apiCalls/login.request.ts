import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const loginRequest = async (email: string, password: string) => {

    try {
        const response = await axios.post(
            endpoint+"/chat-mate-api/login",
            {
                email: email,
                password: password
            },
            {
                withCredentials: true,
                headers: {
                    'id': JSON.parse(localStorage.getItem("userInfo") as string)?._id
                }
            }
        )
        return { message: "Login Successful!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}