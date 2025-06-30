// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import'./Navbar.css'; //←インポート
import'./Navbarmenu.css';

function Navbar() {
  return (
    <nav className="navbar"> {/*←クラス名 */}
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/works">Works</Link></li>
        <li><Link to="/Blog">Blog</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/Sitemap">Sitemap</Link></li>
          </ul>
          </nav>
  );
}

export default Navbar;
