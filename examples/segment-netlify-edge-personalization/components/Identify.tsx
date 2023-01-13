import React, { useState } from "react";
import { useScores } from "@uniformdev/context-react";
import { useCookies } from "react-cookie";
import Traits from "./Traits";

const Identify = () => {
  const scores = useScores();
  const [username, userInput] = useInput({ type: "text" });
  const [cookies] = useCookies();

  const onIdentifyClick = (e) => {
    e.preventDefault();
    Object.keys(scores).forEach((k) => {
      let persona = "Unknown";
      if (k === "p_d") {
        persona = "Developer";
      } else if (k === "p_m") {
        persona = "Marketer";
      }

      global.analytics.identify(username, {
        traits: {
          persona,
          score: scores[k],
        },
      });
    });
  };

  return (
    <div>
      {userInput} {username} <br />
      <button onClick={onIdentifyClick}>Identify User</button>
      <h2>Current Segment User Id</h2>
      <div>{cookies["ajs_anonymous_id"]}</div>
      <h2>Current Segment Anonymous User Id</h2>
      <div>{cookies["ajs_user_id"]}</div>
      <Traits />
    </div>
  );
};

function useInput({ type /*...*/ }) {
  const [value, setValue] = useState("");
  const input = (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      type={type}
    />
  );
  return [value, input];
}

export default Identify;
