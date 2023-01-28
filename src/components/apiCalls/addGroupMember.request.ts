import axios from 'axios'

export const addGroupMemberRequest = async (conversationId: string, userId: string, message: string) => {

    try {
        const response = await axios.patch(
            "http://localhost:5000/chat-mate-api/add-group-member",
            {
                conversationId: conversationId,
                user: userId,
                message: message
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