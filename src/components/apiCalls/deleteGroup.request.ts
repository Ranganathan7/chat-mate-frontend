import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const deleteGroupRequest = async (conversationId: string) => {

    try {
        const response = await axios.post(
            endpoint+"/chat-mate-api/delete-group",
            {
                conversationId: conversationId
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