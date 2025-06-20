import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer";

const Plombir = () => {
    return (
        <div className={styles.pageContainer}> {/* This wrapper is good for overall page layout */}

            <Header />

            <main>
                <div className={styles.main__container2}>
                    <div className={styles.plate_row}>
                        <a href="/plombirator" className={styles.plate}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/plombirator.jpg`} alt="Пломбиратор" className={styles.image} />
                            <div className={styles.plate_text}>
                                <h2 className={styles.name}>Пломбиратор</h2>
                            </div>
                            {/* The price is outside plate_text, which is fine, but we'll manage its positioning */}
                            <h3 className={styles.price}>1800₽</h3>
                        </a>

                        {/* <a href="/roundMetal" className={styles.plate}>
                            <img src={`${process.env.PUBLIC_URL}/resourses/catato.jpg`} alt="Металлическая" className={styles.image} />
                            <div className={styles.plate_text}>
                                <h2 className={styles.name}>Металлическая</h2>
                            </div>
                            <h3 className={styles.price}>600₽</h3>
                        </a> */}
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    );
}

export default Plombir;