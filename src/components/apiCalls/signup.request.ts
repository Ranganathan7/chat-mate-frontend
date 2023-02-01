import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const signupRequest = async (name: string, email: string, password: string, pic: string) => {

    try {
        const response = await axios.post(
            endpoint+"/chat-mate-api/signup",
            {
                name: name,
                email: email,
                password: password,
                pic: pic
            },
            {
                withCredentials: true
            }
        )
        return { message: "Account Created Successfully!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}