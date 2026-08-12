// src/components/Header.js
import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <object
        type="image/svg+xml"
        data="/assets/cosmic-geometry-header.svg"
        className="zodiac-svg"
        aria-label="Cosmic Geometry Header"
      />
    </header>
  );
};

export default Header;
