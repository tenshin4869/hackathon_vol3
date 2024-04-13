import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";

import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

// ... (他のimport文は変更なし)

const Home = () => {
  const [postList, setPostList] = useState([]);

  // 各カードのexpanded状態を管理する配列
  const [expandedArray, setExpandedArray] = React.useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(collection(db, "posts"));
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      // 初期のexpanded状態をfalseで設定
      setExpandedArray(Array(data.docs.length).fill(false));
    };
    getPosts();
  }, []);

  const navigate = useNavigate();

  const handleCardClick = (post) => {
    navigate(`/post/${post.id}`, { state: post });
  };

  const current_theme = localStorage.getItem("current_theme");
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");

  const handleDelete = async (id) => {
    const docRef = doc(db, "posts", id);
    try {
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
      window.location.href = "/";
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);

  const { user } = useAuthContext();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div className={`container ${theme}`}>
        <Navbar theme={theme} setTheme={setTheme} />
        <div className="homePage">
          <div className="cardContainer">
            {postList.map((post, index) => {
              const isExpanded = expandedArray[index];
              const handleExpandClick = () => {
                const newExpandedArray = [...expandedArray];
                newExpandedArray[index] = !isExpanded;
                setExpandedArray(newExpandedArray);
              };

              return (
                <Card
                  sx={{ maxWidth: 300 }}
                  key={post.id}
                  onClick={() => handleCardClick(post)}
                >
                  <CardHeader title={post.author.username}></CardHeader>
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={190}
                    width={300}
                    bgcolor="white"
                  >
                    <Typography variant="h5" color="textPrimary">
                      {post.title}
                    </Typography>
                  </Box>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {post.subtitle}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <Checkbox
                      {...label}
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                    />
                    {post.author.id === auth.currentUser.uid && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(post.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                    <IconButton
                      aria-expanded={isExpanded}
                      aria-label="show more"
                      onClick={handleExpandClick}
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                  </CardActions>
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>{post.title}</Typography>
                      <Typography paragraph>{post.postText}</Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
};

export default Home;
