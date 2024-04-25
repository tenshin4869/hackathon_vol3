import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import { Routes, Route } from "react-router-dom"; // BrowserRouterのインポートを削除
import { AuthProvider } from "./context/AuthContext";
import CreatePost from "./components/CreatePost";
import PostDetail from "./components/PostDetail";

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: "2em" }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/createpost" element={<CreatePost />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
