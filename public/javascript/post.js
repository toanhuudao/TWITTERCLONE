import axios from "axios";
import {timeDifference} from "./untils/timestamp";

export const createPost = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "http://127.0.0.1:3004/api/posts",
            data
        });
        return res.data
    } catch (e) {
        if (e.response) {
            return e.response.data;
        }
        console.log(e)
        return e
    }
}

export const createPostHtml = (postData) => {
    const postedBy = postData.postedBy;
    const displayName = postedBy.firstName + " " + postedBy.lastName;
    const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    const isActiveClass = postData.isLikeByCurrentUser ? "active" : "";

    let replyFlag = "";
    if(postData.replyTo){
      const replyToUserName = postData.replyTo.postedBy.userName;
        replyFlag = `<div class="replyFlag">
        Replying to <a href="/profile/${replyToUserName}">@${replyToUserName}</a>
        </div>`
    }

    let buttons = "";
    if (postData.postedBy._id === userLoggedIn._id){
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal"> 
                        <i class="fas fa-times"></i>
                    </button>`;
    }

    return `<div class="post" data-id="${postData._id}">
                <div class="mainContentContainer">
                     <div class="userImageContainer">
                        <img src="${postedBy.profilePic}" alt="user picture">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.userName}" class="displayName">${displayName}</a>
                            <span class="username">${postedBy.userName}</span>
                            <span class="date">${timestamp}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
                        <div class="postBody">
                            <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button data-toggle ="modal" data-target ="#replyModal">
                                    <i class="far fa-comment"></i>
                                </button>
                            </div>
                             <div class="postButtonContainer green">
                                <button class="retweetButton">
                                    <i class="fas fa-retweet"></i>
                                    <span></span>
                                </button>
                            </div>
                             <div class="postButtonContainer red">
                                <button class="likeButton ${isActiveClass}">
                                    <i class="far fa-heart"></i>
                                    <span>${postData.likedByUsers.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
`
}

export const getPosts = async () => {
    try {
        const res = await axios({
            url: "http://127.0.0.1:3004/api/posts",
        });
        return res.data
    } catch (e) {
        if (e.response) {
            return e.response.data;
        }
        console.log(e)
        return e
    }

};
export const outputPosts = (results, container) => {
    console.log(results)
    container.html("");
    results.forEach(postData => {
        const html = createPostHtml(postData);
        container.append(html);
    })
    if (results.length === 0) {
        container.append(`<span>Nothing to show.</span>`)
    }
};

export const likePostToggle = async (postId) => {

    try {
        const res = await axios({
            method: 'PUT',
            url: `http://127.0.0.1:3004/api/posts/${postId}/likes`
        })

        return res.data
    } catch (e) {
        if (e.response) return e.response.data
        return e
    }
}

export const getPostIdFromElement = (element) => {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot ? element : element.closest(".post");
    const postId = rootElement.data("id");
    if (!postId) return alert("Post id undefined");
    return postId;
}

export const retweetPostToggle = async (postId) => {

    try {
        const res = await axios({
            method: 'PUT',
            url: `http://127.0.0.1:3004/api/posts/${postId}/retweets`
        })
        return res.data
    } catch (e) {
        if (e.response) return e.response.data
        return e
    }
}

export const getPostData =async (postId) => {
    try {
        const res = await axios({
            method:"GET",
            url: `http://127.0.0.1:3004/api/posts/${postId}`
        })
        return res.data
    } catch (e) {
        if (e.response) return e.response.data
        return e
    }
}
