import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useScores } from "@uniformdev/context-react";
import Traits from "./Traits";

const Profile = () => {
  const scores = useScores();
  const [cookies] = useCookies();
  const [anonymousId, setAnonymousId] = useState();
  const [trackerScores, setTrackerScores] = useState<any>();

  useEffect(() => {
    const friendlyScores = Object.keys(scores).map((k) => {
      let persona = k;
      if (k === "p_d") {
        persona = "Developer";
      } else if (k === "p_m") {
        persona = "Marketer";
      }
      return { name: persona, score: scores[k] };
    });

    setTrackerScores(friendlyScores);
    setAnonymousId(cookies["ajs_anonymous_id"]);
  }, [scores, cookies]);

  return (
    <div>
      <h2>Current visitor scores from Uniform Tracker:</h2>
      <pre>{JSON.stringify(trackerScores)}</pre>
      <h2>Segment User Id:</h2>
      <pre>{anonymousId}</pre>
      <Traits />
    </div>
  );
};

export default Profile;
