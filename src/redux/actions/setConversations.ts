import ConversationType from "../../types/conversation.type"

const setConversations = (conversations: ConversationType[]) => {
    
    return {
        type: "SET_CONVERSATIONS",
        payload: conversations
    }
}

export default setConversations