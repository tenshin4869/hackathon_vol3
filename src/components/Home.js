import db, { auth } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const getStrTime = (time) => {
  let t = new Date(time);
  return `${t.getFullYear()}/${
    t.getMonth() + 1
  }/${t.getDate()} ${t.getHours()}:${t.getMinutes()}`;
};

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigation = useNavigate();
  const { user } = useAuthContext();
  const handleLogout = () => {
    auth.signOut();
    navigation("/login");
  };

  useEffect(() => {
    onSnapshot(collection(db, "posts"), (posts) => {
      setPosts(
        posts.docs
          .map((post) => post.data())
          .sort((a, b) => b.created_at - a.created_at)
      );
    });
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div>
        <h1>ホームページ</h1>
        <p>投稿一覧</p>
        {posts.map((post) => (
          <div className="post">
            <div className="title">タイトル：{post.title}</div>
            <div className="content">内容：{post.content}</div>
            <div className="created_at">
              投稿日：{getStrTime(post.created_at)}
            </div>
          </div>
        ))}
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }
};

export default Home;
