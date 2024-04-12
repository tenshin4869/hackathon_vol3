import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(collection(db, "posts"));
      // console.log(data);
      // console.log(data.docs);
      // console.log(data.docs.map((doc) => ({ doc })));
      // console.log(data.docs.map((doc) => ({ ...doc.data() })));
      setPostList(data.docs.map((doc) => ({ ...doc.data() })));
    };
    getPosts();
  }, []);

  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");
  const handleDelete = async (id) => {
    // ドキュメントの参照を取得
    const docRef = doc(db, "posts", id);

    try {
      // ドキュメントを削除
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div className={`container ${theme}`}>
        <Navbar theme={theme} setTheme={setTheme} />

        {/*仮のCSSを組み込んだ（デザイン汚い）*/}
        <div className="homePage">
          {postList.map((post) => {
            return (
              <div className="postContents" key={post.author.id}>
                <div className="postHeader">
                  <h1>{post.title}</h1>
                </div>

                <div className="postHeader">
                  <p>{post.subtitle}</p>
                </div>

                <div className="postTextContainer">{post.postText}</div>
                <div className="nameAndDeleteButton">
                  <h3>@{post.author.username}</h3>
                  <button onClick={() => handleDelete(post.author.id)}>
                    削除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Home;
