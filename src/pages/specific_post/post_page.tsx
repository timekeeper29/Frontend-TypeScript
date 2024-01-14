import React, { useEffect, useRef, useState } from 'react';
import styles from "./index.module.css"
import { Comment, CommentDB, Post } from '../../models/general';
import PostLikeComment from '../../features/post/post_like_comment/post_like_comment';
import no_image from "./../../pictures/no_image.jpg"
import PostLikeBox from '../../features/post/post_like_box/post_like_box';
import { useLocation, useNavigate } from 'react-router-dom';
import PostBoxTitle from '../../features/post/post_box_title/post_box_title';
import { timeAgo } from '../../features/post/serviec';
import { Button, IconButton, TextField } from '@mui/material';
import { createComment, getCommentsByPost } from '../../api/post_api';
import { useAuth } from '../../contexts/AuthContexts';
import UserComment from './../../features/comment/Comment';

interface PostPageProps {

}

function PostPage({ }: PostPageProps) {

    const navigate = useNavigate()
    const location = useLocation();

    const post = location.state?.post

    // const [post, setPost] = useState<Post>()
    const [text, setText] = useState("")

    const [showComments, setShowComments] = useState(false)
    const [currComments, setCurrComments] = useState<Comment[]>([])


    const { user: userLoggedIn, accessToken } = useAuth()

    useEffect(() => {
        getComments();
    }, [])

    if (!post) return <></>

    const { likes, dislikes, title, createdAt, user, _id, comments } = post

    const postTimestep = timeAgo(createdAt.getTime())
    const info = `Posted by ${user.username} ${postTimestep}`


    const getComments = async () => {
        const response: Comment[] = await getCommentsByPost(post._id);
        setCurrComments(response)
    }

    const closePage = () => {
        navigate(-1)
    }

    const handleCommentClicked = async () => {

        if (!accessToken || !userLoggedIn) return

        try {
            const comment: CommentDB = await createComment(post._id, accessToken, { content: text, username: userLoggedIn.username })
            setCurrComments([...currComments, comment])
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowComment = async () => {
        if (!showComments) {
            // const commentsDATA = await getCommentsByPost(post._id)
            // setPost({ ...post, comments: [...commentsDATA] })
        }
        setShowComments(!showComments)
    }

    return (
        <>
            <div className={styles.container}>


                <div className={styles.headline}>
                    <div className={styles.left_header} >
                        <PostLikeBox {...{ likes, dislikes, postId: _id, style: { backgroundColor: "white" } }} />
                        <PostBoxTitle  {...{ info, title }}></PostBoxTitle>
                    </div>

                    <IconButton className={styles.closeIcon} onClick={closePage}>X</IconButton>


                </div>
                <img
                    className={styles.image}
                    src={no_image}
                    alt="Circular Avatar"
                />

                <PostLikeComment {...{ type: 'SHOW', handleShowComment, comments: currComments }}></PostLikeComment>

                <div className={styles.comments_container}>

                    {showComments ?
                        <div className={styles.comments_area}>
                            {currComments.map((comment) => {
                                return (
                                    <div className={styles.comment_wrapper}>
                                        <UserComment setCurrComments={setCurrComments} comment={comment} key={comment.commentId} />
                                        <div className={styles.devider}></div>
                                    </div>
                                )
                            })}
                        </div> : <></>}
                </div>


                <TextField
                    className={styles.wide_text_box}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder='Text'
                    multiline
                    rows={5}
                    maxRows={10}
                />
                <div className={styles.comment_button}>
                    <Button variant='contained' size='small' onClick={handleCommentClicked}>Comment</Button>
                </div>

            </div>
        </>
    );
}

export default PostPage;