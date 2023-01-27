import { toast } from "react-toastify"; 

function checkPassword(password: string): string[] {
    const text: string[] = []
    if(!password) {
        toast.error("Please enter the password", { autoClose:5000, position: toast.POSITION.BOTTOM_RIGHT })
        return ["Enter the password"]
    }
    //lowercase
    if (! password.match(/[a-z]/g)) {
        text.push("Password must contain atleast one lowercase letter");
    }
    //uppercase
    if (! password.match(/[A-Z]/g)) {
        text.push("Password must contain atleast one uppercase letter")
    }
    //number
    if (! password.match(/[0-9]/g)) {
        text.push("Password must contain atleast one number")
    }
    //special character
    if (! password.match(/[!,@,#,$,%,^,&,*]/g)) {
        text.push("Password must contain atleast one special character(!,@,#,$,%,^,&,*)")
    }
    //length
    if (password.length < 8) {
        text.push("Password must be atleast eight characters long")
    }
    return text
}

export default checkPassword