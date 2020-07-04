import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "components/app-context";
import { Button } from "components/button";
import { ACTIONS } from "actions";
import { VIEWS } from "enums";
import prettyMilliseconds from "pretty-ms";

function Timer({ startTime }) {
  const [time, setTime] = useState(startTime);

  useEffect(() => {
    let timeout = setTimeout(() => {
      setTime(time - 1000);
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [time]);

  return <div className="pa3 mv2 f2">{prettyMilliseconds(time)}</div>;
}

export function StartStandup() {
  const [state, dispatch] = useContext(AppContext);
  const { teamMembers, order, timePerMember } = state;
  const [currentIndex, setCurrentIndex] = useState(0);
  const memberId = order[currentIndex];
  const member = teamMembers[memberId];
  const isLastMember = currentIndex === order.length - 1;

  function changeView(view = VIEWS.ADD_MEMBERS) {
    dispatch({
      type: ACTIONS.CHANGE_VIEW,
      view,
    });
  }

  function handleRestartStandup() {
    changeView();
  }

  function handleEndStandup() {
    changeView(VIEWS.SUMMARY);
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
