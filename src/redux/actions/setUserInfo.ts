const setUserInfo = (userInfo: string) => {
    
    return {
        type: "SET_USER_INFO",
        payload: JSON.parse(userInfo)
    }
}

export default setUserInfo