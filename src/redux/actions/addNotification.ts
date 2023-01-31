import ConversationType from "../../types/conversation.type"

const addNotification = (notification: string) => {
    
    return {
        type: "ADD_NOTIFICATION",
        payload: notification
    }
}

export default addNotification