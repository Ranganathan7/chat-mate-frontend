import ConversationType from "../../types/conversation.type"

const removeNotification = (notification: string) => {
    
    return {
        type: "REMOVE_NOTIFICATION",
        payload: notification
    }
}

export default removeNotification