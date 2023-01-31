import ChatType from "./chat.type"
import ConversationType from "./conversation.type"
import UserType from "./user.type"

type StateType = {
    userInfo?: UserType ,
    conversations?: ConversationType[],
    selectedConversation?: ConversationType,
    notifications?: string[]
}

export default StateType