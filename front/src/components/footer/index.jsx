import styles from "./style.module.scss";
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <div className={styles.footer2}>
            <div className={styles.Column}>
                <h3>Главные странички</h3>
                <Link to="/about">О нас</Link>
                <Link to="/categories">Категории</Link>
                <Link to="/contacts">Контакты</Link>
                <Link to="/cart">Корзина</Link>
            </div>
            <div className={styles.Column}>
                <h3>Печати гербовые</h3>
                <Link to="/gerb1">Гербовая</Link>
            </div>
            <div className={styles.Column}>
                <h3>ИП и ООО</h3>
                <Link to="/individ">Для ИП и ООО</Link>
            </div>
            <div className={styles.Column}>
                <h3>Таблички</h3>
                <Link to="/tabLaserCat">Лазерная гравировка</Link>
                <Link to="/tab3dCat">Объёмные буквы</Link>
                <Link to="/tabApplicationCat">Аппликация плёнкой</Link>
            </div>
        </div>
    );
}

export default Footer;