import axios from 'axios'

export const logoutRequest = async () => {

    try {
        const response = await axios.post(
            "http://localhost:5000/chat-mate-api/logout",
            {},
            {
                withCredentials: true
            }
        )
        return { message: response.data.message }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}