import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useScores } from "@uniformdev/context-react";
import Traits from "./Traits";

const Profile = () => {
  const scores = useScores();
  const [cookies] = useCookies();
  const [anonymousId, setAnonymousId] = useState();
  const [userId, setUserId] = useState();
  const [trackerScores, setTrackerScores] = useState<any>();

  useEffect(() => {
    const friendlyScores = Object.keys(scores).map((k) => {
      let persona = "Unknown";
      if (k === "p_d") {
        persona = "Developer";
      } else if (k === "p_m") {
        persona = "Marketer";
      }
      return { name: persona, score: scores[k] };
    });

    setTrackerScores(friendlyScores);
    setAnonymousId(cookies["ajs_anonymous_id"]);
    setUserId(cookies["ajs_user_id"]);
  }, [scores, cookies]);

  return (
    <div>
      <h2>Current visitor scores from Uniform Tracker:</h2>
      <div>{JSON.stringify(trackerScores)}</div>
      <h2>Segment User Id:</h2>
      <div>{anonymousId}</div>
      <h2>Segment Anonymous User Id:</h2>
      <div>{userId}</div>
      <Traits />
    </div>
  );
};

export default Profile;
