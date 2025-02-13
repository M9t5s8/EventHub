document.addEventListener("DOMContentLoaded", function () {

    const commentForm = document.getElementById("form-comment");
    const replyForm = document.getElementById("form-reply")


    //comment form and its handling
    if (commentForm) {
        commentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const commentContent = document.getElementById("comment-content").value.trim();
            const eventId = document.getElementById("event-id").value;
            if (!commentContent) {
                return;
            }
            const formData = new FormData();
            formData.append("event_id", eventId);
            formData.append("comment_content", commentContent);

            fetch("/add_comment/", {
                method: "POST",
                headers: { "X-CSRFToken": getCSRFToken() },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        addCommentToDOM(data);
                        const noCommentElement = document.getElementById("no-comment");
                        if (noCommentElement) {
                            noCommentElement.style.display = "none";
                        }
                        commentForm.reset();
                    } else {
                        alert("Failed to add comment: " + data.message);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred while adding the comment.");
                });
        });
    }
    function addCommentToDOM(data) {
        const commentList = document.querySelector(".comment-list");
        const newComment = document.createElement("div");
        newComment.classList.add("comment-portion");
        newComment.innerHTML = `
            <div class="comment-part">
                <div class="organizer-profile">
                    <div class="profile-image-wrapper">
                        <img src="${data.profile_picture}" alt="${data.username}" class="profile-img">
                    </div>
                    <div class="organizer-info">
                        <p class="organizer-name">${data.username}</p>
                        <p class="event-created-time">Just now</p>
                    </div>
                </div>
                <div class="comments">
                    <p class="comment">${data.content}</p>
                    <hr style="background: #bbb; height: 2px; margin: 3px 0 3px 0;">
                    <div class="comment-actions">
                        <button class="like-btn" data-comment-id="${data.comment_id}">
                            <i class="fa-regular fa-thumbs-up regular-icon"></i>
                            <i class="fa-solid fa-thumbs-up solid-icon"></i>
                            <span class="like-count">${data.likes_count}</span>
                        </button>
                        <button class="dislike-btn" data-comment-id="${data.comment_id}">
                            <i class="fa-regular fa-thumbs-down regular-icon"></i>
                            <i class="fa-solid fa-thumbs-down solid-icon"></i>
                            <span class="dislike-count">${data.dislikes_count}</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        commentList.prepend(newComment);
        attachLikeDislikeListeners(newComment);

    }





    // this is when loading the page
    document.querySelectorAll(".comment-part, .reply-part").forEach(item => {
        attachLikeDislikeListeners(item);
    });

    function attachLikeDislikeListeners(item) {
        item.querySelectorAll(".like-btn, .dislike-btn").forEach(button => {
            button.addEventListener("click", function () {
                handleLikeDislike(this);
            });
        });
    }

    function handleLikeDislike(button) {
        const isLike = button.classList.contains("like-btn");
        const isComment = button.hasAttribute("data-comment-id");
        const itemId = isComment ? button.getAttribute("data-comment-id") : button.getAttribute("data-reply-id");
        const countSpan = button.querySelector(".like-count, .dislike-count");
        const oppositeButton = button.parentElement.querySelector(isLike ? ".dislike-btn" : ".like-btn");
        const isActive = button.classList.contains(isLike ? "liked" : "disliked");

        // Handle opposite button state for both comment and reply
        if (oppositeButton.classList.contains(isLike ? "disliked" : "liked")) {
            oppositeButton.classList.remove(isLike ? "disliked" : "liked");
            const oppositeCountSpan = oppositeButton.querySelector(".like-count, .dislike-count");
            oppositeCountSpan.textContent = Math.max(0, parseInt(oppositeCountSpan.textContent) - 1);
        }

        // Toggle the active state for the current button
        button.classList.toggle(isLike ? "liked" : "disliked");

        // Update the count for the button
        countSpan.textContent = isActive ? Math.max(0, parseInt(countSpan.textContent) - 1) : parseInt(countSpan.textContent) + 1;

        // Send the request to the backend for both comments and replies
        fetch(`/${isComment ? "comment" : "reply"}/${isLike ? "like" : "dislike"}/${itemId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ [isLike ? "liked" : "disliked"]: !isActive })
        })
            .then(response => response.json())
            .then(data => {

                if (data.success) {
                    countSpan.textContent = isLike ? data.likes_count : data.dislikes_count;
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }



    // reply form and data handling
    document.querySelectorAll(".reply-btn").forEach(button => {
        button.addEventListener("click", function () {
            const commentId = this.getAttribute("data-comment-id");
            const replySection = document.getElementById(`reply-section-${commentId}`);


            document.querySelectorAll(".reply-section").forEach(section => {
                if (section.id !== `reply-section-${commentId}`) {
                    section.style.display = "none";
                }
            });



            if (replySection) {
                replySection.style.display = (replySection.style.display === "none" || replySection.style.display === "") ? "block" : "none";
            }
        });
    });
    if (replyForm) {
        replyForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const commentId = this.getAttribute("data-comment-id");
            console.log("", commentId)
            const replyContent = document.getElementById("reply-content").value.trim();

            if (!replyContent) {
                return;
            }

            const formData = new FormData();
            formData.append("comment_id", commentId);
            formData.append("reply_content", replyContent);
            fetch("/add_reply/", {
                method: "POST",
                headers: {
                    "X-CSRFToken": getCSRFToken(),
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log("Hello");
                        addReplyToDOM(commentId, data);
                        replyForm.reset();
                    } else {
                        alert("Failed to add reply: " + data.message);
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("An error occurred while adding the reply.");
                });
        });
    }
    function addReplyToDOM(commentId, data) {
        const replyContainer = document.getElementById(`reply-section-${commentId}`);
        if (!replyContainer) {
            console.error(`Reply container not found for comment ID: ${commentId}`);
            return;
        }

        const newReply = document.createElement("div");
        newReply.classList.add("reply-part");
        newReply.innerHTML = `
            <div class="organizer-profile">
                <div class="profile-image-wrapper">
                    <img src="${data.profile_picture}" alt="${data.username}" class="profile-img">
                </div>
                <div class="organizer-info">
                    <p class="organizer-name">${data.username}</p>
                    <p class="event-created-time">Just now</p>
                </div>
            </div>
            <div class="replies">
                <p class="reply">${data.content}</p>
                <hr style="background: #bbb; height: 1px; margin: 3px 0 3px 0;">
                <div class="reply-actions">
                    <button class="like-btn" data-reply-id="${data.reply_id}">
                        <i class="fa-regular fa-thumbs-up regular-icon"></i>
                        <i class="fa-solid fa-thumbs-up solid-icon"></i>
                        <span class="like-count">${data.likes_count}</span>
                    </button>
                    <button class="dislike-btn" data-reply-id="${data.reply_id}">
                        <i class="fa-regular fa-thumbs-down regular-icon"></i>
                        <i class="fa-solid fa-thumbs-down solid-icon"></i>
                        <span class="dislike-count">${data.dislikes_count}</span>
                    </button>
                </div>
            </div>
        `;

        replyContainer.appendChild(newReply);
        attachLikeDislikeListeners(newReply);
    }





    // token
    function getCSRFToken() {
        return document.cookie.split("; ").find(row => row.startsWith("csrftoken="))?.split("=")[1] || "";
    }
});
