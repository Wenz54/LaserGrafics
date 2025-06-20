import styles from "./style.module.scss"
import Header from "../header/index"
import Footer from "../footer/index"

const About = () => {
    return (
        <div className={styles.aboutPage}>
            <Header />

            <main>
                <div className={styles.about__inner}>
                    <div className={styles.about__owerlay}>
                        <div className={styles.about__text}>
                            <h2>О компании</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident ab fugiat numquam velit aspernatur dolorum quidem nisi perspiciatis consequatur laudantium, obcaecati voluptatibus consequuntur quam in culpa repellat quis animi natus. lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatibus, fugit perspiciatis, illo voluptates debitis unde, similique sed aspernatur quos dignissimos provident ducimus placeat. Rem possimus numquam aut soluta officia? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident ab fugiat numquam velit aspernatur dolorum quidem nisi perspiciatis consequatur laudantium, obcaecati voluptatibus consequuntur quam in culpa repellat quis animi natus. lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatibus, fugit perspiciatis, illo voluptates debitis unde, similique sed aspernatur quos dignissimos provident ducimus placeat. Rem possimus numquam aut soluta officia?</p>
                        </div>
                        <div className={styles.about__statistic}>
                            <div className={styles.statistic__column}>
                                <h2 className={styles.barabulka}>220</h2>
                                <p>Чего-то там нами крутейше и классно и вообще супер нами сделано вот.</p>
                            </div>
                            <div className={styles.statistic__column}>
                                <h2 className={styles.barabulka}>228</h2>
                                <p>Чёто там у нас в наличии и активно используется.</p>
                            </div>
                            <div className={styles.statistic__column}>
                                <h2 className={styles.barabulka}>237</h2>
                                <p>Анекдотов в час рассказывается нашим гендиректором.</p>
                            </div>
                            <div className={styles.statistic__column}>
                                <h2 className={styles.barabulka}>402</h2>
                                <p>Сотрудника были успешно обмануты на деньги (но мы самая честная компания).</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </div>
    );
}

export default About;