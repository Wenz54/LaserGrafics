import React from 'react';
import Header from "../header/index";
import styles from "./style.module.scss"; // Assuming you have a corresponding SCSS file

const InDev = () => {
    return (
        <body>


            <Header />
            <div className={styles.pageContainer}>

                <h4 className={styles.developmentMessage}>Страница в разработке</h4>
            </div>
        </body>
    );
}

export default InDev;