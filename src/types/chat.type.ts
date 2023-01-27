import ConversationType from "./conversation.type"
import UserType from "./user.type"

type ChatType = {
    _id: string,
    content: string,
    author: UserType,
    conversation: ConversationType,
    updatedAt: Date,
    createdAt: Date
}

export default ChatType