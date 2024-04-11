import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import NewPost from "./components/NewPost";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: "2em" }}>
        <BrowserRouter>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <div>
                  <Home />
                  <NewPost />
                </div>
              }
            />
            <Route path="/signup" element={<SignUp />} />
            {/* <Route path="/signup" element={<PublicRoute />} /> */}
            <Route path="/login" element={<Login />} />
            {/* <Route path="/login" element={<PublicRoute />} /> */}
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
