import styles from "./style.module.scss";
import Header from "../header/index"; // Using header2 as per your import
import { Link } from 'react-router-dom';
import Footer from "../footer";

const MainPage = () => {
    return (
        <div className={styles.mainPageWrapper}> {/* New main wrapper class */}
            <Header />
            <main>
                {/* Section 1: Hero Section */}
                <section className={styles.heroSection}> {/* Standardized class name */}
                    <div className={styles.heroOverlay}> {/* Standardized class name */}
                        <div className={styles.heroContent}> {/* Standardized class name */}
                            <div className={styles.heroTitleAnimation}> {/* Standardized class name */}
                                <h1 className={styles.heroTitle}> {/* Standardized class name */}
                                    ЛАЗЕР <br /> ГРАФИКС
                                </h1>
                            </div>
                            <div className={styles.heroDescription}> {/* Standardized class name */}
                                <p>
                                    Мы занимаемся изготовлением качественных печатей и штампов, а также сувенирной и иной продукции на профессиональном оборудовании родом из Австрии и США.<br /> Хотите заказать что-то у нас?
                                    <br /> Переходите в
                                    <Link to="/categories" className={styles.heroLink}>категории</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: "About Us / Location" */}
                <section className={styles.locationSection}> {/* Standardized class name */}
                    <div className={styles.locationText}> {/* Standardized class name */}
                        <h2 className={styles.locationTitle}>Где мы находимся</h2>
                        <p className={styles.locationDescription}>
                            Мы всегда рады видеть вас в нашем офисе. Приходите и обсудим ваш проект лично!
                        </p>
                    </div>

                    <div className={styles.locationMap}> {/* Standardized class name */}
                        <iframe
src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3218.8467192721937!2d39.717671789776624!3d47.28079290555556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1685898993239!5m2!1sru!2sru"                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Our Location"
                        ></iframe>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}

export default MainPage;