import React from "react";
import "./Navbar.css";
import logo_light from "../assets/logo-black.png";
import logo_dark from "../assets/logo-white.png";
import search_icon_light from "../assets/search-w.png";
import search_icon_dark from "../assets/search-b.png";
import toggle_light from "../assets/night.png";
import toggle_dark from "../assets/day.png";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar({ theme, setTheme, setSearchQuery }) {
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggle_mode = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };
  const navigation = useNavigate();
  const handleLogout = () => {
    auth.signOut();
    navigation("/login");
  };

  return (
    <div className="navbar">
      <img
        src={theme === "light" ? logo_light : logo_dark}
        alt=""
        className="logo"
      />
      <ul>
        <Link to="/" className="ul-Link">
          Home
        </Link>
        <Link to="/createpost" className="ul-Link">
          CreatePost
        </Link>
        <Link to="/login" className="ul-Link" onClick={handleLogout}>
          Logout
        </Link>
      </ul>

      <div className="search-box">
        <input type="text" placeholder="Search" onChange={handleSearchChange} />
        <img
          src={theme === "light" ? search_icon_light : search_icon_dark}
          alt=""
        />
      </div>

      <img
        onClick={() => {
          toggle_mode();
        }}
        src={theme === "light" ? toggle_light : toggle_dark}
        alt=""
        className="toggle-icon"
      />
    </div>
  );
}
