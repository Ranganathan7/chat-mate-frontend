import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const editGroupPicRequest = async (conversationId: string, pic: string, message: string) => {

    try {
        const response = await axios.patch(
            endpoint+"/chat-mate-api/edit-group-pic",
            {
                conversationId: conversationId,
                conversationPic: pic,
                message: message
            },
            {
                withCredentials: true,
                headers: {
                    'id': JSON.parse(localStorage.getItem("userInfo") as string)?._id
                }
            }
        )
        return { message: "Updated successfully!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}