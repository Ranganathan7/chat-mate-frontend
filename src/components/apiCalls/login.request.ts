import axios from 'axios'

export const loginRequest = async (email: string, password: string) => {

    try {
        const response = await axios.post(
            "http://localhost:5000/chat-mate-api/login",
            {
                email: email,
                password: password
            },
            {
                withCredentials: true
            }
        )
        return { message: "Login Successful!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}