"use client";
import './HamburgerButton.css';

const HamburgerButton = ({ isOpen, toggle }) => {
  return (
    <div className={`hamburger ${isOpen ? 'open' : ''}`} onClick={toggle}>
      <div className="bar"></div>
      <div className="bar"></div>
      <div className="bar"></div>
    </div>
  );
};

export default HamburgerButton;
