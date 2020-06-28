import React, {useContext, useState} from "react";
import {AppContext} from "components/app-context";

export function CurrentMember() {
  const [state] = useContext(AppContext);
  const { order = [], teamMembers = {}, timePerMember } = state;
  const [currentIndex, setCurrentIndex] = useState(1);
  const { name, id } = teamMembers[order[currentIndex]] || {};
  const [remaningTime, setRemaningTime] = useState(timePerMember);
  setTimeout(() => {
    setRemaningTime(remaningTime - 1);
  }, timePerMember);
  return (
    <>
      <div>{name}</div>
      <div>Time remaining: {remaningTime}</div>
    </>
  );
}

export function StartStandup() {
  const [start, setStart] = useState(false);
  return (
    <div>
      {!start && (
        <button
          className="f6 link dim br1 ph3 pv2 mb2 dib white bg-purple"
          onClick={() => setStart(true)}
        >
          Start Standup
        </button>
      )}
      {start && <CurrentMember />}
      {start && (
        <button
          className="f6 link dim br1 ph3 pv2 mb2 dib white bg-purple"
          onClick={() => setStart(false)}
        >
          reset
        </button>
      )}
    </div>
  );
}