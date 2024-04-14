// PostDetail.js
import { useAuthContext } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./PostDetail.css";
import HTMLFlipBook from "react-pageflip";
import Checkbox from "@mui/material/Checkbox";
import { Favorite, FavoriteBorder, Margin } from "@mui/icons-material";
import StarsOutlinedIcon from "@mui/icons-material/StarsOutlined";
import StarsRoundedIcon from "@mui/icons-material/StarsRounded";
import { yellow } from "@mui/material/colors";
import Button from "@mui/material/Button";
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const label = { inputProps: { "aria-label": "Checkbox demo" } };
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="cover" ref={ref} data-density="hard">
      <div>
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <p>{props.children}</p>
      <p>{props.number}</p>
    </div>
  );
});

const PostDetail = (props) => {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [commentList, setCommentList] = useState([]);
  const [commenter, setCommenter] = useState();
  const [comment, setComment] = useState();
  //コメントを見るとき
  const [openSee, setOpenSee] = React.useState(false);
  const handleOpenSee = () => setOpenSee(true);
  const handleCloseSee = () => setOpenSee(false);

  //postに記事内容を格納
  const post = location.state;
  const current_theme = localStorage.getItem("current_theme");
  const collectionPath = collection(db, "posts", post.id, "comments");

  //コメント機能の実装
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
  const [theme, setTheme] = useState(current_theme ? current_theme : "light");
  useEffect(() => {
    localStorage.setItem("current_theme", theme);
  }, [theme]);
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!post) {
    return <div>Loading...</div>;
  }
  return (
    <div className={`container ${theme}`}>
      <Navbar theme={theme} setTheme={setTheme} />
      <body bgcolor="#808080">
        <div>
          <HTMLFlipBook
            width={450}
            height={600}
            minWidth={315}
            maxWidth={1000}
            minHeight={420}
            maxHeight={1350}
            showCover={true}
            flippingTime={1000}
            style={{ margin: "0 auto" }}
            maxShadowOpacity={0.5}
            className="album-web"
          >
            <PageCover
              style={{
                textAlign: "center",
                paddingTop: "50px",
                margin: "0 50px",
              }}
            >
              <div
                style={{
                  padding: "45px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#333",
                }}
                className="box-title"
              >
                <h2>{post.title}</h2>
              </div>
              <div
                style={{
                  padding: "100px",
                  fontWeight: "bold",
                  color: "#333",
                }}
                className="username"
              >
                <h2>username:{post.author.username}</h2>
              </div>
            </PageCover>
            <PageCover></PageCover>
            <Page number="1">
              <div className="container">
                <main>
                  <h1>{post.title}</h1>
                  <p contentEditable="true">{post.postText.slice(0, 400)}</p>
                </main>
              </div>
            </Page>
            <Page number="2">
              <div className="container">
                <main>
                  <h1>{post.title}</h1>
                  <p contentEditable="true">{post.postText.slice(400)}</p>
                </main>
              </div>
            </Page>
            <PageCover>
              <div className="pagecontent">
                <div className="pageitem">
                  <div className="center-content">
                    <Checkbox
                      sx={{
                        color: yellow[800],
                        "&.Mui-checked": {
                          color: yellow[600],
                        },
                        marginRight: "16px",
                      }}
                      {...label}
                      icon={<StarsOutlinedIcon sx={{ fontSize: 40 }} />}
                      checkedIcon={<StarsRoundedIcon sx={{ fontSize: 40 }} />}
                    />{" "}
                    <div style={{ alignItems: "center" }}>
                      <MapsUgcIcon
                        sx={{ fontSize: 40, marginRight: "10px" }}
                        onClick={handleOpen}
                      />
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            コメントしよう！
                          </Typography>
                          <TextField
                            required
                            id="outlined-required"
                            label="ユーザー名"
                            defaultValue=""
                            onChange={(e) => setCommenter(e.target.value)}
                          />
                          <TextField
                            id="outlined-multiline-flexible"
                            label="コメント"
                            multiline
                            maxRows={4}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <button
                            className="postButton"
                            onClick={(e) => {
                              createComment();
                              handleClose();
                            }}
                          >
                            投稿する
                          </button>
                        </Box>
                      </Modal>
                      <p
                        style={{
                          fontSize: "7px",
                          color: "rgba(0, 0, 0, 0.6)",
                          margin: 0,
                        }}
                      >
                        応援コメント
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outlined"
                    size="medium"
                    sx={{ margin: "10px" }}
                    onClick={handleOpenSee}
                  >
                    みんなのコメント
                  </Button>
                  <Modal
                    open={openSee}
                    onClose={handleCloseSee}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        コメント一覧
                      </Typography>
                      <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {commentList.map((comment) => (
                          <div className="comments" key={comment.id}>
                            <div className="postHeader">
                              <p>{comment.comment}</p>
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
                      </Typography>
                    </Box>
                  </Modal>
                </div>
              </div>
            </PageCover>
          </HTMLFlipBook>
        </div>
      </body>
    </div>
  );
};

export default PostDetail; // ここでexport defaultを追加
