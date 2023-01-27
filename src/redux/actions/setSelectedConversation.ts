import ConversationType from "../../types/conversation.type"
import UserType from "../../types/user.type";

const setSelectedConversation = (conversation: ConversationType) => {
    
    return {
        type: "SET_SELECTED_CONVERSATION",
        payload: conversation
    }
}

export default setSelectedConversation