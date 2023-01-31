import ConversationType from "../../types/conversation.type"

const setNotifications = (notifications: string[]) => {
    
    return {
        type: "SET_NOTIFICATIONS",
        payload: notifications
    }
}

export default setNotifications