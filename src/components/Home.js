import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Home.css";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import { useTheme } from "../context/ThmeContext";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import Fab from "@mui/material/Fab";
import Divider from "@mui/material/Divider";

const Home = () => {
  const { theme } = useTheme();
  const [postList, setPostList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = postList.filter((post) => {
    return (
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.postText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // 各カードのexpanded状態を管理する配列
  const [expandedArray, setExpandedArray] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(collection(db, "posts"));
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      // 初期のexpanded状態をfalseで設定
      setExpandedArray(Array(data.docs.length).fill(false));
    };
    getPosts();
  }, []);

  const handleCardClick = (post) => {
    navigate(`/post/${post.id}`, { state: post });
  };

  const handleCreateClick = () => {
    navigate("./createpost");
  };

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

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div className={`container ${theme}`}>
        <Navbar setSearchQuery={setSearchQuery} />
        <div className="homePage">
          <div className="cardContainer">
            {filteredPosts.map((post, index) => {
              const isExpanded = expandedArray[index];
              const handleExpandClick = () => {
                const newExpandedArray = [...expandedArray];
                newExpandedArray[index] = !isExpanded;
                setExpandedArray(newExpandedArray);
              };

              return (
                <Card sx={{ maxWidth: 300 }} key={post.id}>
                  <CardHeader title={post.author.username}></CardHeader>
                  <Divider variant="middle" />
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height={190}
                    width={300}
                    bgcolor="white"
                    onClick={() => handleCardClick(post)}
                  >
                    <Typography variant="h5" color="textPrimary">
                      {post.title}
                    </Typography>
                  </Box>
                  <Divider variant="middle" />
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
        <Box position="fixed" bottom={30} right={50} zIndex={1000}>
          <Fab
            color="primary"
            aria-label="edit"
            onClick={() => handleCreateClick()}
          >
            <EditIcon />
          </Fab>
        </Box>
      </div>
    );
  }
};

export default Home;
