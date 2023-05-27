import React, { useState } from "react";
import { useScores } from "@uniformdev/context-react";
import { useCookies } from "react-cookie";

const OverrideAnonymousId = () => {
  const scores = useScores();
  const [newAnonymousId, setAnonymousId] = useInput({ type: "text" });
  const [cookies] = useCookies();
  const onAnonymousIdOverride = (e) => {
    let persona = "Unknown";
    Object.keys(scores).forEach((k) => {
      if (k === "p_d") {
        persona = "Developer";
      } else if (k === "p_m") {
        persona = "Marketer";
      }
    });

    global.analytics.setAnonymousId(newAnonymousId);
    global.analytics.track("Id reset", {
      traits: {
        persona,
        scores,
      },
    });

    window.location.reload(false);
  };

  return (
    <div>
      <h2>Current Anonymous Id: {cookies["ajs_anonymous_id"]}</h2>
      <p>You can override the current visitors' anonymous id with a new one if you want to fetch another profile from Segment.</p>
      {setAnonymousId}
      <button onClick={(e) => onAnonymousIdOverride(e)}>
        Override anonymous id
      </button>
      {/* for future <hr />
      <h2>Current User Id: {cookies["ajs_user_id"] ?? "not set"}</h2> */}
    </div>
  );
};

function useInput({ type }) {
  const [value, setValue] = useState("");
  const input = (
    <input
      value={value}
      placeholder="put a new anonymous id here"
      onChange={(e) => setValue(e.target.value)}
      style={{ width: "300px" }}
      type={type}
    />
  );
  return [value, input];
}

export default OverrideAnonymousId;
