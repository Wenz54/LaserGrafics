import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer";
import { Link } from "react-router-dom";

const MacroCat = () => {
    return (
        <main>
            <Header />
            <div className={styles.main__container2}>
                <div className={styles.plate_row}>
                    <Link to="/stampsCat" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/pechati/menti.jpg`} alt="Гербовые" />
                        <div className={styles.plate_text}>
                            <h2>Печати, штампы</h2>
                            <p>Печати гербовые для государственных учереждений, нотариусов, адвокатов. Печати для физлиц, ИП и ООО</p>
                        </div>
                    </Link>

                    <Link to="/plombirator" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/plombirator.png`} alt="Пломбиратор" />
                        <div className={styles.plate_text}>
                            <h2>Пломбираторы</h2>
                            <p>Пломбираторы, металлические печати, устройства для опечатывания, сургуч, пломбы свинцовые, пломбировочная мастика</p>
                        </div>
                    </Link>

                    <Link to="/tabels" className={styles.plate}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/tabel.jpg`} alt="Таблички" />
                        <div className={styles.plate_text}>
                            <h2>Таблички</h2>
                            <p>  Вывески фасадные,

                                таблички офисные,

                                таблички адресные,

                                таблички настольные,

                                знаки и указатели, информационные стенды.</p>
                        </div>
                    </Link>


                </div>
            </div>
            <Footer />
        </main>
        
    );
}

export default MacroCat;
