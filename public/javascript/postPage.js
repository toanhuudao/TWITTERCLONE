import {createPostHtml} from "./post";

const {outputPosts} = require("./post");
const {getPostData} = require("./post");

function outputPostWithReplies(data, container) {
    container.html("");

    if (data.replyTo){
        const html = createPostHtml(data.replyTo);
        container.append(html);
    }

    data.replies.forEach(postData => {
        const html = createPostHtml(postData);
        container.append(html);
    })

}

$(document).ready(async () => {
    const data = await getPostData(postId);
    outputPostWithReplies(data,$(".postsDetailContainer"))
})