import "@babel/polyfill";
import {submit} from "./Register";
import {login} from "./login";

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form")

if (registerForm) {
    registerForm.addEventListener("submit", async (evt) => {
        evt.preventDefault();
        const formData = new FormData();
        formData.append("firstName", registerForm.querySelector(".firstName").value);
        formData.append("lastName", registerForm.querySelector(".lastName").value);
        formData.append("userName", registerForm.querySelector(".userName").value);
        formData.append("email", registerForm.querySelector(".email").value);
        formData.append("password", registerForm.querySelector(".password").value);
        formData.append("passwordConf", registerForm.querySelector(".passwordConf").value);
        await submit(formData)
    })
}

if (loginForm) {
    loginForm.addEventListener("submit",  (evt) => {
        evt.preventDefault();
        const logUserName = loginForm.querySelector(".log-user").value;
        const logPassword = loginForm.querySelector(".log-password").value;
        console.log(logUserName,logPassword)
         login(logUserName, logPassword);
    })
}