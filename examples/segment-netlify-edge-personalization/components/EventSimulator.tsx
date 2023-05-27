import React, { useState } from "react";

const EventSimulator = () => {
  const [message, setMessage] = useState<string>(
    "Simulate an event using one of the buttons below:"
  );

  const onOrderComplete = (e) => {
    e.preventDefault();
    global.analytics.track("Order Completed", {
      product: "123",
      amount: "10000",
      category: "Coffee Machines",
    });
    setMessage("'Order Completed' event dispatched (amount: 10000)");
  };

  const onAddToCart = (e) => {
    e.preventDefault();
    global.analytics.track("Add to cart", {
      product: "456",
      category: "Beans",
    });
    setMessage("'Product add to cart' event dispatched");
  };

  const onProductFavorite = (e) => {
    e.preventDefault();
    global.analytics.track("Product Favorited", {
      product: "456",
      category: "Beans",
    });
    setMessage("'Product Favorited' event dispatched");
  };

  return (
    <div>
      <h2>{message}</h2>
      <button onClick={onProductFavorite}>Favorite a product</button>
      <hr />
      <button onClick={onAddToCart}>Add to cart</button>
      <hr />
      <button onClick={onOrderComplete}>Complete an order</button>
    </div>
  );
};

export default EventSimulator;
