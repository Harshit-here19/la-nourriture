import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import Modal from "../UI/Modal";

import classes from "./Cart.module.css";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = (props) => {
  const ctx = useContext(CartContext);

  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [error, setError] = useState(null);

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

  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "https://la-nourriture-5750d-default-rtdb.firebaseio.com/orders.json",
        {
          method: "POST",
          body: JSON.stringify({
            user: userData,
            orderItems: ctx.items,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong!!");
      }

      setDidSubmit(true);
      ctx.clearCart();
    } catch (e) {
      console.log(e);
      setError(e.message);
      setDidSubmit(false);
    }

    setIsSubmitting(false);
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

  const cartModalContent = (
    <>
      {cartItems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>

      {isCheckout && (
        <Checkout onClose={props.close} onConfirm={submitOrderHandler} />
      )}

      {!isCheckout && modalActions}
    </>
  );

  const isSubmittingModalContent = <p>Placing Order...</p>;

  const didSubmitModalContent = (
    <>
      <p>Succefully Order placed...</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.close}>
          Close
        </button>
      </div>
    </>
  );

  const errorModalContent = (
    <>
      <p>{error}</p>
      <div className={classes.actions}>
        <button className={classes.button} onClick={props.close}>
          Close
        </button>
      </div>
    </>
  );

  return (
    <Modal close={props.close}>
      {!error && !isSubmitting && !didSubmit && cartModalContent}
      {!error && isSubmitting && isSubmittingModalContent}
      {!error && !isSubmitting && didSubmit && didSubmitModalContent}
      {error && errorModalContent}
    </Modal>
  );
};

export default Cart;
