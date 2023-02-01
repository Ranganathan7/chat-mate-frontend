import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const getConversationRequest = async (conversationId: string) => {

    try {
        const response = await axios.get(
            endpoint+"/chat-mate-api/get-conversation/"+conversationId,
            {
                withCredentials: true,
                headers: {
                    'id': JSON.parse(localStorage.getItem("userInfo") as string)?._id
                }
            }
        )
        return { res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}