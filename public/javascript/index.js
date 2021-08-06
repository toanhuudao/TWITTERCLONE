import "@babel/polyfill";
import {submit} from "./Register";
import {login} from "./login";
import {createPost, createPostHtml, getPosts, outputPosts} from "./post";
import  "./home"


const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form")
const postTextarea = document.getElementById("postTextarea");
const submitButton = document.getElementById("submitPostButton");
const postsContainer = $(".postsContainer");

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
    loginForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        const logUserName = loginForm.querySelector(".log-user").value;
        const logPassword = loginForm.querySelector(".log-password").value;
        console.log(logUserName, logPassword)
        login(logUserName, logPassword);
    })
}

if (postTextarea) {
    postTextarea.addEventListener("keyup", (evt) => {
        {
            const textBox = evt.target.value.trim();
            if (textBox) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        }
    })
}

if (submitButton) {
    submitButton.addEventListener("click", async (evt) => {
        const data = {
            content: postTextarea.value.trim(),
        }
        const postData = await createPost(data);
        if (postData.status === "success") {
            const html = createPostHtml(postData.post);
            document.querySelector(".postsContainer").insertAdjacentHTML("afterbegin", html);
            postTextarea.value = "";
            submitButton.disabled = true;
        }
    })


}

if (postsContainer) {
    $(document).ready(async () => {
        const res = await getPosts();
        outputPosts(res.posts, postsContainer);
    })

}
