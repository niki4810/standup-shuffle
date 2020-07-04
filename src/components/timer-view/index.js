import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "components/app-context";
import { Button } from "components/button";
import { ACTIONS } from "actions";
import { VIEWS } from "enums";
import prettyMilliseconds from "pretty-ms";
import classNames from "classnames";
import shuffle from "lodash.shuffle";

function Timer({ startTime }) {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (time <= 0) {
        clearTimeout(timeout);
      } else {
        setTime(time - 1000);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  const classes = classNames("pa3 mv2 f2", {blink: time === 0});

  return (
    <div className={classes}>
      {prettyMilliseconds(time, { colonNotation: true })}
    </div>
  );
}

export function StartStandup() {
  const [state, dispatch] = useContext(AppContext);
  const { teamMembers, order, timePerMember } = state;
  const [currentIndex, setCurrentIndex] = useState(0);
  const memberId = order[currentIndex];
  const member = teamMembers[memberId];
  const isLastMember = currentIndex === order.length - 1;


  function handleRestartStandup() {
    dispatch({
      type: ACTIONS.CHANGE_VIEW,
      view: VIEWS.ADD_MEMBERS,
      order: shuffle(order)
    });
  }

  function handleEndStandup() {
    dispatch({
      type: ACTIONS.CHANGE_VIEW,
      view: VIEWS.SUMMARY,
      standupEndTime: Date.now()
    });
  }

  function handleNextClick() {
    setCurrentIndex(currentIndex + 1);
  }

  return (
    <div className="flex flex-column items-center justify-center">
      <div className="f1">{member.name}</div>
      <Timer key={memberId} startTime={timePerMember} />
      <div className="flex mt4">
        <Button onClick={handleRestartStandup}>Restart Standup</Button>
        {!isLastMember && <Button onClick={handleNextClick}>Next</Button>}
        {isLastMember && (
          <Button onClick={handleEndStandup}>End Standup</Button>
        )}
      </div>
    </div>
  );
}
