import React from "react";

const NewPost = () => {
  return (
    <>
      <p>新規投稿</p>
      <form>
        <input type="text" placeholder="タイトル" />
        <input type="text" placeholder="内容" />
        <button type="submit">投稿</button>
      </form>
    </>
  );
};

export default NewPost;
