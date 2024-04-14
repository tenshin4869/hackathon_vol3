import React, { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import Navbar from "../components/Navbar";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const PostDetail = () => {
  const [commentList, setCommentList] = useState([]);
  const [commenter, setCommenter] = useState();
  const [comment, setComment] = useState();

  const location = useLocation();
  const post = location.state;
  const collectionPath = collection(db, "posts", post.id, "comments");

  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");

  const handleDelete = async (id) => {
    const docRef = doc(db, "posts", post.id, "comments", id);
    try {
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
      window.location.href = `/post/${post.id}`;
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  const getComments = async () => {
    const data = await getDocs(collectionPath);
    setCommentList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getComments();
  }, []);

  const createComment = async () => {
    await addDoc(collectionPath, {
      comment: comment,
      commenter: {
        username: commenter,
        id: auth.currentUser.uid,
      },
    });
    // コメントを投稿した後、コメントリストを再取得して更新する
    getComments();
  };

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    if (!post) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className={`container ${theme}`}>
          <Navbar theme={theme} setTheme={setTheme} />
          <div className="postDetailContainer">
            <h2>{post.title}</h2>
            <p>{post.subtitle}</p>
            <p>{post.postText}</p>
            {/* その他の詳細情報の表示 */}
          </div>
          {commentList.map((comment) => (
            <div className="comments" key={comment.id}>
              <div className="postHeader">
                <h1>{comment.comment}</h1>
              </div>
              <div className="postHeader">
                <p>{comment.commenter.username}</p>
              </div>
              {comment.commenter.id === auth.currentUser.uid && (
                <IconButton
                  aria-label="delete"
                  onClick={() => handleDelete(comment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}

          <div className="createComment">
            <div className="postContainer">
              <h1>コメントを投稿する</h1>
              <div className="inputPost">
                <div>名前</div>
                <input
                  type="text"
                  placeholder="名前を記入"
                  onChange={(e) => setCommenter(e.target.value)}
                />
              </div>
              <div className="inputPost">
                <div>コメント内容</div>
                <textarea
                  placeholder="コメント内容を記入"
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <button className="postButton" onClick={createComment}>
                投稿する
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
};

export default PostDetail; // ここでexport defaultを追加
