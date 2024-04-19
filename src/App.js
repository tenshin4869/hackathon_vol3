import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import CreatePost from "./components/CreatePost";
import PostDetail from "./components/PostDetail";

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: "2em" }}>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/" element={<CreatePost />} />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="/signup" element={<PublicRoute />} /> */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/login" element={<PublicRoute />} /> */}
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
