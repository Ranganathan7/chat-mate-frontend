import axios from 'axios'
import { endpoint } from './ENDPOINT'

export const editProfileRequest = async (name: string, pic: string, online: boolean) => {

    try {
        const response = await axios.patch(
            endpoint+"/chat-mate-api/edit-profile",
            {
                name: name,
                pic: pic,
                online: online
            },
            {
                withCredentials: true,
                headers: {
                    'id': JSON.parse(localStorage.getItem("userInfo") as string)?._id
                }
            }
        )
        return { message: "Updated Successfully!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}