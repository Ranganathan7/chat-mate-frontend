import axios from 'axios'

export const editGroupNameRequest = async (conversationId: string, name: string, message: string) => {

    try {
        const response = await axios.patch(
            "http://localhost:5000/chat-mate-api/edit-group-name",
            {
                conversationId: conversationId,
                conversationName: name,
                message: message
            },
            {
                withCredentials: true
            }
        )
        return { message: "Updated successfully!", res: response.data }
    } catch (error: any) {
        if(error.response.data.message) return { error: error.response.data.message }
        else return { error: "error while communicating to server" }
    }

}