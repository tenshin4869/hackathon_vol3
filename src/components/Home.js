import { auth } from "../firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

const Home = () => {
  const navigation = useNavigate();
  const { user } = useAuthContext();
  const handleLogout = () => {
    auth.signOut();
    navigation("/login");
  };

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return (
      <div>
        <Navbar />
        <h1>ホームページ</h1>
        <button onClick={handleLogout}>ログアウト</button>
      </div>
    );
  }
};

export default Home;
