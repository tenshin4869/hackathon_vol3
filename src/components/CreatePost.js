import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import "./CreatePost.css";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  //タイトルを格納
  const [title, setTitle] = useState();
  const [subtitle, setSubTitle] = useState();
  //投稿内容を格納
  const [postText, setPostText] = useState();
  //著者名を格納
  const [author, setAuthor] = useState();

  //ホームにリダイレクトする
  const navigate = useNavigate();

  const createPost = async () => {
    await addDoc(collection(db, "posts"), {
      title: title,
      subtitle: subtitle,
      postText: postText,
      author: {
        username: author,
        id: auth.currentUser.uid,
      },
    });

    navigate("/");
  };

  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <div className="createPostPage">
        <div className="postContainer">
          <h2>記事を投稿する</h2>
          <div className="inputPost">
            <div>タイトル</div>
            <input
              type="text"
              placeholder="タイトルを記入"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="sub-inputPost">
            <div>サブタイトル</div>
            <input
              type="text"
              placeholder="サブタイトルを記入"
              onChange={(e) => setSubTitle(e.target.value)}
            />
          </div>
          <div className="inputPost">
            <div>投稿内容</div>
            <textarea
              placeholder="投稿内容を記入"
              onChange={(e) => setPostText(e.target.value)}
            ></textarea>
          </div>
          {/*著者名を記述*/}
          <div className="inputPost">
            <div>ユーザ名</div>
            <input
              type="text"
              placeholder="ユーザ名を記入"
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <button className="postButton" onClick={createPost}>
            投稿する
          </button>
        </div>
      </div>
    </div>
  );
}
