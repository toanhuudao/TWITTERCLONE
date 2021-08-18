import "@babel/polyfill";
import "jquery"
import {submit} from "./Register";
import {login} from "./login";
import "./postPage"

import {
    createPost,
    createPostHtml,
    getPosts,
    outputPosts,
    likePostToggle,
    getPostIdFromElement,
    retweetPostToggle, getPostData, deletePostData
} from "./post";
import "./home"
import axios from "axios";

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
        button.find("span").text(postData.totalRetweetOfPost || "")
        // if (postData.data.isActive) {
        //     button.addClass("active");
        // } else {
        //     button.removeClass("active");
        // }
    })

    //TODO 1
    $("#replyModal").on("show.bs.modal", async (evt) => {
        const button = $(evt.relatedTarget);
        const postId = getPostIdFromElement(button);
        const postData = await getPostData(postId);
        // originalPostContainer
        outputPosts([postData.data], $("#originalPostContainer"));
        $("#submitReplyButton").attr("data-id", postId)
    })

    //TODO 2
    $("#replyModal").on("hidden.bs.modal", async (evt) => {
        $("#originalPostContainer").html("");
    })

    $("#submitReplyButton").click(async (evt) => {
        const button = $(evt.target)
        const id = button.data("id");
        const textBox = $("#replyTextarea");
        if (!id) return alert("button id is null");
        let data = {
            content: textBox.val(),
            replyTo: id

        }
        const responseData = await createPost(data);
        if (responseData) {
            location.reload();
        }
    })

    $(document).on("click", ".post", evt => {
        const element = $(evt.target);
        const postId = getPostIdFromElement(element);

        if (postId !== undefined && !element.is("button") && !element.is("i")) {
            window.location.href = `posts/${postId}`
        }

    });

    $("#deletePostModal").on("show.bs.modal", async (evt) => {
        const button = $(evt.relatedTarget);
        const postId = getPostIdFromElement(button);
        $("#submitDeleteButton").data("id", postId);
    })

    $(document).on("click", "#submitDeleteButton",async (evt) => {
        const postId =  $("#submitDeleteButton").data().id
       const res = await deletePostData(postId);
        console.log(res)
        if (res.status === "success"){
            location.reload();
        }
    })


})