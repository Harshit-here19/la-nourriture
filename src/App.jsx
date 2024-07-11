import React, { useState } from "react";
import Cart from "./components/Cart/Cart";
import Header from "./components/Layout/Header";
import Meals from "./components/Meals/Meals";
import CartProvider from "./store/CartProvider";

const App = () => {
  const [showCartModal, setShowCartModal] = useState(false);

  const closeCartModalHandler = () => {
    setShowCartModal(false);
  };

  const showCartModalHandler = () => {
    setShowCartModal(true);
  };

  return (
    <CartProvider>
      {showCartModal && <Cart close={closeCartModalHandler} />}
      <Header showCart={showCartModalHandler} />
      <main>
        <Meals />
      </main>
    </CartProvider>
  );
};

export default App;
