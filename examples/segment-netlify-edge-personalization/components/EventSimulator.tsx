import React, { useState } from "react";

const EventSimulator = () => {
  const [message, setMessage] = useState<string>("Simulate an event using one of the buttons below:");

  const onOrderComplete = (e) => {
    e.preventDefault();
    global.analytics.track("Order Completed", {
      product: "123",
      amount: "10000",
      category: "Coffee Machines",
    });
    setMessage("'Order Completed' event dispatched (amount: 10000)");
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
      <h1>{message}</h1>
      <button onClick={onProductFavorite}>Favorite Product</button>
      <button onClick={onOrderComplete}>Complete Order</button>
    </div>
  );
};

export default EventSimulator;
