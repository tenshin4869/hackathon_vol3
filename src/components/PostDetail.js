// PostDetail.js

import React from "react";
import { useLocation } from "react-router-dom";

const PostDetail = () => {
  const location = useLocation();
  const post = location.state;

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="postDetailContainer">
      <h2>{post.title}</h2>
      <p>{post.subtitle}</p>
      <p>{post.postText}</p>
      {/* その他の詳細情報の表示 */}
    </div>
  );
};

export default PostDetail; // ここでexport defaultを追加
