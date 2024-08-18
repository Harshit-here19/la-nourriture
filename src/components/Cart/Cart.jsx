import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";

import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const ctx = useContext(CartContext);

  const [isCheckout, setIsCheckout] = useState(false);

  const totalAmount = `$${ctx.totalAmount.toFixed(2)}`;
  const hasItem = ctx.items.length > 0;

  const cartItemRemoveHadler = (id) => {
    ctx.removeItem(id);
  };

  const cartItemAddHadler = (item) => {
    ctx.addItem({ ...item, amount: 1 });
  };

  const cartItems = (
    <ul className={classes["cart-items"]}>
      {ctx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          price={item.price}
          amount={item.amount}
          onRemove={cartItemRemoveHadler.bind(null, item.id)}
          onAdd={cartItemAddHadler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const orderHandler = () => {
    setIsCheckout(true);
  };

  const modalActions = (
    <div className={classes.actions}>
      <button className={classes["button--alt"]} onClick={props.close}>
        Close
      </button>
      {hasItem && (
        <button className={classes.button} onClick={orderHandler}>
          Order
        </button>
      )}
    </div>
  );

  return (
    <Modal close={props.close}>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>

      {isCheckout && <Checkout onClose={props.close} />}

      {!isCheckout && modalActions}
    </Modal>
  );
};

export default Cart;
