import React, { useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import styles from "./style.module.scss";

const Header = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) { // Check if ref is present
        if (window.scrollY > 0) {
          headerRef.current.classList.add(styles.scrolled);
        } else {
          headerRef.current.classList.remove(styles.scrolled);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header ref={headerRef} className={styles.header}> {/* Apply base 'header' style here */}
      <Link to="/" className={styles.logoLink}> {/* Add a class for logo styling */}
        <img src={`${process.env.PUBLIC_URL}/resourses/LOGO.png`} alt="logo" />
      </Link>
      {/* Removed .src div as it was empty and served no apparent purpose */}
      <nav className={styles.mainNav}> {/* Add a class for main navigation */}
        <Link to="/about">О нас</Link>
        <Link to="/categories">Категории</Link>
        <Link to="/contacts">Контакты</Link>
        <Link to="/cart">Корзина</Link>
      </nav>
      {/* If you need a separate "login/cart" section, consider adding it here with a specific class */}
    </header>
  );
}

export default Header;