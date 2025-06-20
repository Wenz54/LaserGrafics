import React, { useState, useEffect } from 'react';
import styles from "./style.module.scss";
import Header from '../header/index';
import Footer from '../footer/index';
import RightSide from '../rightSide/index';
import StuffUnit from '../stuffUnit/index';

const App = () => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const handleDelete = (item) => {
        // Assuming 'item' has a unique identifier like 'id' for robust deletion
        // If not, relying on object reference 'cartItem !== item' is less reliable
        // For now, I'll keep your original logic but recommend adding an 'id' to your cart items.
        const updatedCart = cart.filter(cartItem => cartItem !== item);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (item, newQuantity) => {
        const updatedCart = cart.map(cartItem => {
            // Again, assuming 'item' reference equality, but 'id' is better
            if (cartItem === item) {
                return { ...cartItem, quantity: newQuantity };
            }
            return cartItem;
        });
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    return (
        <div className={styles.appWrapper}> {/* Main app wrapper */}
            <Header />
            <main className={styles.mainContent}> {/* Main content area */}
                <div className={styles.cartPageContainer}> {/* New container for cart layout */}
                    <div className={styles.cartItemsSection}> {/* Left side for cart items */}
                        <ul className={styles.cartList}> {/* List of cart items */}
                            {cart.length > 0 ? (
                                cart.map((item, index) => (
                                    <StuffUnit
                                        key={index} // Consider using a unique ID from 'item' if available
                                        item={item}
                                        onDelete={() => handleDelete(item)}
                                        onQuantityChange={(newQuantity) => handleQuantityChange(item, newQuantity)}
                                    />
                                ))
                            ) : (
                                <p className={styles.emptyCartMessage}>Ваша корзина пуста.</p>
                            )}
                        </ul>
                    </div>
                    <div className={styles.cartSummarySection}> {/* Right side for summary */}
                        <RightSide cart={cart} />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;