import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <div style={{ margin: "2em" }}>
        <Router>
          <Routes>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
