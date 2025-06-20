import styles from "./style.module.scss";
import Header from "../header/index";
import Footer from "../footer/index"; // Assuming you have a Footer component

const Contacts = () => {
    return (
        <div className={styles.contactsPage}> {/* Добавил общий контейнер для всей страницы */}
            <Header />
            <main>
                <div className={styles.contactInner}>
                    <div className={styles.contactOverlay}>
                        <div className={styles.overlayInner}>
                            <h2>Свяжитесь с Лазер Графикс!</h2>
                            <div className={styles.overlayColumns}>
                                <div className={styles.owColumn}>
                                    <h3>Почте</h3> {/* Изменил h2 на h3 для семантики */}
                                    <a href="mailto:wenz5455@gmail.com">Gmail</a> {/* Добавил mailto: для реальных ссылок */}
                                    <a href="mailto:mail@example.com">Mail</a>
                                    <a href="mailto:yandex@example.com">Yandex</a>
                                </div>
                                <div className={styles.owColumn}>
                                    <h3>Мессенджеры</h3> {/* Изменил h2 на h3 */}
                                    <a href="https://t.me/yourtelegram">Telegram</a>
                                    <a href="https://wa.me/70000000000">Whatsapp</a>
                                </div>
                                <div className={styles.owColumn}>
                                    <h3>Номер</h3> {/* Изменил h2 на h3 */}
                                    <a href="tel:+79895148843">+7(989)-514-88-43</a>
                                </div>
                                <div className={styles.owColumn}>
                                    <h3>Соцсети</h3> {/* Изменил h2 на h3 */}
                                    <a href="https://t.me/yourtelegramchannel">Telegram</a>
                                    <a href="https://vk.com/yourvkpage">VK</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Contacts;