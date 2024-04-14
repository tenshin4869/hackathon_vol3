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
const label = { inputProps: { "aria-label": "Checkbox demo" } };

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

  //postに記事内容を格納
  const post = location.state;
  const current_theme = localStorage.getItem("current_theme");
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
                      <MapsUgcIcon sx={{ fontSize: 40, marginRight: "10px" }} />
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
                  >
                    みんなのコメント
                  </Button>
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
