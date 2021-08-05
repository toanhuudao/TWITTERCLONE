import axios from "axios";

export const login = async (logUsername, logPassword) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3004/login",
            data: {
                logUsername: logUsername,
                logPassword: logPassword
            },
            withCredentials: true
        })

        console.log(res)

        if (res.data.errorMessage) {
            document.querySelector(".errorMessage").innerHTML = `${res.data.errorMessage}`
        }
        if (res.data.errorMessage === undefined) {
            window.location.href="http://127.0.0.1:3004"
        }
    } catch (e) {
        console.log(e)
    }



}