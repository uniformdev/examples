import React, { useState, useEffect } from "react";

const Traits = () => {
  const [traits, setTraits] = useState(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [error, setError] = useState<Boolean>(false);
  useEffect(() => {
    const url = "/api/traits";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json.traits);
        setTraits(json.traits);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log("error", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Segment traits</h2>
      <div>{error ? <h3>Error fetching traits</h3> : null}</div>
      <div>
        {loading ? (
          <h3>Loading</h3>
        ) : (
          <div>
            {!error && (!traits || Object.keys(traits).length <= 0) ? (
              "no traits present"
            ) : (
              <pre>{JSON.stringify(traits)}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Traits;
