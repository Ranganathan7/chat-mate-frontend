import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const createPrivateConversationRequest = async (userId: string) => {

    try {
        const response = await axios.post(
            endpoint+"/chat-mate-api/create-private-conversation",
            {
                userId: userId
            },
            {
                withCredentials: true
            }
        )
        return { res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}