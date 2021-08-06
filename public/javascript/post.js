import axios from "axios";
import {timeDifference} from "./untils/timestamp";

export const createPost = async (data) => {
    try {
        const res = await axios({
            method: "POST",
            url: "api/posts",
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

    return `<div class="post">
                <div class="mainContentContainer">
                     <div class="userImageContainer">
                        <img src="${postedBy.profilePic}" alt="user picture">
                    </div>
                    <div class="postContentContainer">
                        <div class="header">
                            <a href="/profile/${postedBy.userName}" class="displayName">${displayName}</a>
                            <span class="username">${postedBy.userName}</span>
                            <span class="date">${timestamp}</span>
                        </div>
                        <div class="postBody">
                            <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class="postButtonContainer">
                                <button>
                                    <i class="far fa-comment"></i>
                                </button>
                            </div>
                             <div class="postButtonContainer">
                                <button>
                                    <i class="fas fa-retweet"></i>
                                </button>
                            </div>
                             <div class="postButtonContainer">
                                <button>
                                    <i class="far fa-heart"></i>
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
            url: "api/posts",
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
    container.html("");
    results.forEach(result => {
        const html = createPostHtml(result);
        container.append(html);
    })
    console.log(container)
    if (results.length===0){
        container.append(`<span>Nothing to show.</span>`)
    }
};



