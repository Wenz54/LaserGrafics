import styles from "./style.module.scss";
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import { Link } from "react-router-dom"; // Import Link for proper navigation

const TabelsCategory = () => {
    return (
        <div className={styles.categoryPage}> {/* Standardized class name */}
            <Header />
            <main>
                <div className={styles.categoryContainer}> {/* Standardized class name */}
                    <div className={styles.categoryRow}> {/* Standardized class name */}

                        <Link to="/tabFasadLaser" className={styles.categoryCard}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/tabel.jpg`} alt="Фасадная табличка" className={styles.cardImage} />
                            <div className={styles.cardText}>
                                <h2 className={styles.cardTitle}>Фасадная</h2>
                                {/* Added description and price inside cardText for consistent hover effect */}
                                <p className={styles.cardDescription}>Вывески и таблички для фасадов зданий, устойчивые к внешним условиям.</p>
                                <p className={styles.cardPrice}>3.800 - 20.000₽</p>
                            </div>
                        </Link>

                            <Link to="/tabOfficeLaser" className={styles.categoryCard}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/secret.jpg`} alt="Офисная табличка" className={styles.cardImage} />
                            <div className={styles.cardText}>
                                <h2 className={styles.cardTitle}>Офисная</h2>
                                {/* Added description and price inside cardText for consistent hover effect */}
                                <p className={styles.cardDescription}>Таблички для кабинетов и офисных помещений, с различными вариантами исполнения.</p>
                                <p className={styles.cardPrice}>600 - 2.280₽</p>
                            </div>
                        </Link>

                        {/* You can add more category cards here following the same pattern */}

                    </div>
                </div>
            </main>
            <Footer /> {/* Footer moved outside main content container for better structure */}
        </div>
    );
}

export default TabelsCategory;