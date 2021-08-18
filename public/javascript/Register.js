import { showAlert } from "./alert";
import axios from "axios";

export const submit = async (data) => {
    try {
        const res = await axios({
            headers: { "Content-Type": "multipart/form-data" },
            method: "POST",
            url: "http://127.0.0.1:3004/register",
            data
        });
    if (res.data.status === "success"){
        location.assign("/");
    }
    } catch (e) {
        showAlert("error", "error");
    }
}


