import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer";
import { Link } from "react-router-dom";

const MacroCat = () => {
    return (
        <div className={styles.categoryPage}> {/* Using standardized class name */}
            <Header />
            <main>
                <div className={styles.categoryContainer}> {/* Using standardized class name */}
                    <div className={styles.categoryRow}> {/* Using standardized class name */}

                        <Link to="/tabLaserCat" className={styles.categoryCard}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/tabel.jpg`} alt="Гравировка лазером" className={styles.cardImage} /> {/* Standardized class name */}
                            <div className={styles.cardText}> {/* Using standardized class name */}
                                <h2 className={styles.cardTitle}>Гравировка<br />лазером</h2> {/* Standardized class name */}
                                <p className={styles.cardDescription}>Таблички, на которых мы заботливо выгравировали то, что вы скажете нам нашим высококачественным лазером!</p> {/* Standardized class name */}
                            </div>
                        </Link>

                        <Link to="/tab3dCat" className={styles.categoryCard}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/tab3d.jpg`} alt="Объёмные элементы" className={styles.cardImage} />
                            <div className={styles.cardText}>
                                <h2 className={styles.cardTitle}>Объёмные элементы</h2>
                                <p className={styles.cardDescription}>Смотрятся очень презентабельно и привлекают внимание клиентов.</p>
                            </div>
                        </Link>

                        <Link to="/tabApplicationCat" className={styles.categoryCard}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/tabapplication.jpg`} alt="Аппликация плёнкой" className={styles.cardImage} />
                            <div className={styles.cardText}>
                                <h2 className={styles.cardTitle}>Аппликация <br /> плёнкой</h2>
                                <p className={styles.cardDescription}>Плюс этой технологии — невысокая стоимость и возможность легко заменить элементы цветной пленки. Всепогодная, долго сохраняет внешний вид.</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
            <Footer /> {/* Footer moved for consistent structure */}
        </div>
    );
}

export default MacroCat;