import UserType from "./user.type"

type ConversationType = {
    _id: string,
    latestMessage: string,
    latestMessager: UserType,
    conversationName: string,
    conversationPic: string,
    users: UserType[],
    admins: UserType[],
    createdAt: Date,
    updatedAt: Date
}

export default ConversationType