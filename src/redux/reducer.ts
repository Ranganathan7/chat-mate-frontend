import { Reducer } from "redux"
import ChatType from "../types/chat.type"
import ConversationType from "../types/conversation.type"
import StateType from "../types/state.type"
import UserType from "../types/user.type"

type Action = {
    type: string, 
    payload?: UserType | ConversationType[] | ChatType[] | ConversationType | string[] | string
}

const reducer: Reducer = (state: StateType, action: Action) => {
    switch (action.type) {
        case "SET_USER_INFO":
            return {...state, userInfo: action.payload}
         case "SET_CONVERSATIONS":
                return {...state, conversations: action.payload}
        case "SET_SELECTED_CONVERSATION":        
            return {...state, selectedConversation: action.payload}
        case "REMOVE_SELECTED_CONVERSATION":
            const newState =  {...state}
            delete newState.selectedConversation
            return newState
        case "CLEAR_STORE":
            return {}
        case "SET_NOTIFICATIONS":
            return {...state, notifications: action.payload}
        case "REMOVE_NOTIFICATION":
            return {...state, notifications: state.notifications?.filter(item => item !== action.payload)}
        case "ADD_NOTIFICATION":
            return {...state, notifications: [...state?.notifications as string[], action.payload]}
        default:
            return state
    }
}

export default reducer