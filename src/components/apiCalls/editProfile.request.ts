import axios from 'axios'

export const editProfileRequest = async (name: string, pic: string, online: boolean) => {

    try {
        const response = await axios.patch(
            "http://localhost:5000/chat-mate-api/edit-profile",
            {
                name: name,
                pic: pic,
                online: online
            },
            {
                withCredentials: true
            }
        )
        return { message: "Updated Successfully!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}