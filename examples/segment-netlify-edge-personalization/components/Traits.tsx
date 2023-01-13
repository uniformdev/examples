import React, { useState, useEffect } from "react";

const Traits = () => {
  const [traits, setTraits] = useState(null);
  useEffect(() => {
    const url = "/api/traits";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.traits);
        setTraits(json.traits);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Segment traits</h2>
      <div>{JSON.stringify(traits)}</div>
    </div>
  );
};

export default Traits;
