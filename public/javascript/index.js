import "@babel/polyfill";
import {submit} from "./Register";
import {login} from "./login";
import {
    createPost,
    createPostHtml,
    getPosts,
    outputPosts,
    likePostToggle,
    getPostIdFromElement,
    retweetPostToggle
} from "./post";
import "./home"

$(document).ready(async () => {

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
            login(logUserName, logPassword);
        })
    }

    if (postTextarea) {
        postTextarea.addEventListener("keyup", (evt) => {
            {
                const textBox = evt.target.value.trim();
                submitButton.disabled = !textBox;
            }
        })
    }

    if (submitButton) {
        submitButton.addEventListener("click", async (evt) => {
            const data = {
                content: postTextarea.value.trim(),
            }
            postTextarea.value = "";
            submitButton.disabled = true;
            const postData = await createPost(data);
            if (postData.status === "success") {
                const html = createPostHtml(postData.post);
                document.querySelector(".postsContainer").insertAdjacentHTML("afterbegin", html);
            }
        })
    }

    if (postsContainer.length) {
        const res = await getPosts();
        outputPosts(res.posts, postsContainer);
    }

    $(document).on("click", ".likeButton", async (evt) => {

        const button = $(evt.target);
        const postId = getPostIdFromElement(button);
        const postData = await likePostToggle(postId);
        button.find("span").text(postData.totalLikeOfPost || "")
        if (postData.isLikeByCurrentUser) {
            button.addClass("active");
        } else {
            button.removeClass("active");
        }
    })

    $(document).on("click", ".retweetButton", async (evt) => {

        const button = $(evt.target);
        const postId = getPostIdFromElement(button);
        const postData = await retweetPostToggle(postId);
        console.log(postData)
        button.find("span").text(postData.totalRetweetOfPost || "")
        // if (postData.data.isActive) {
        //     button.addClass("active");
        // } else {
        //     button.removeClass("active");
        // }
    })
})