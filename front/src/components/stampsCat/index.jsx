import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer";
import { Link } from "react-router-dom";

const StampsCat = () => {
    return (
        <main>
            <Header />
            <div className={styles.main__container2}>
                <div className={styles.plate_row_kostil}>
                    <Link to="/gerb1" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/pechati/menti.jpg`} alt="Гербовые" />
                        <div className={styles.plate_text}>
                            <h2>Гербовые</h2>
                            <p>Печати гербовые для государственных учереждений, нотариусов, адвокатов.</p>
                        </div>
                    </Link>

                    <Link to="/individ" className={styles.plate}>
                         <img src={`${process.env.PUBLIC_URL}/resourses/pechati/oooAndIp.jpg`} alt="Печать индивидуальная"/>
                        <div className={styles.plate_text}>
                            <h2>Для ИП и ООО</h2>
                            <p>Печати для индивидуательных предпренимателей и обществ с ограниченной ответственностью</p>
                        </div>
                    </Link>

                    {/* <Link to="/gerbDoctor" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/pechati/oooAndIp.png`} alt="Пломбиратор" />
                        <div className={styles.plate_text}>
                            <h2>Врачебные</h2>
                            <p>Печати для врачей, докторов, знахарей, травников, фармацевтов, колдунов-лечителей.</p>
                        </div>
                    </Link> */}
                </div>
            </div>
            <Footer />
        </main>
    );
}

export default StampsCat;