import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const removeGroupMemberRequest = async (conversationId: string, userId: string, message: string) => {

    try {
        const response = await axios.patch(
            endpoint+"/chat-mate-api/remove-group-member",
            {
                conversationId: conversationId,
                userId: userId,
                message: message
            },
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