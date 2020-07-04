import React, { useContext } from "react";
import prettyMilliseconds from "pretty-ms";
import classNames from "classnames";
import { AppContext } from "components/app-context";
import { Button } from "components/button";
import shuffle from "lodash.shuffle";
import { ACTIONS } from "actions";
import { VIEWS } from "enums";

export const SummaryView = () => {
  const [state, dispatch] = useContext(AppContext);

  const { order, totalStandupTime, standupStartTime, standupEndTime } = state;
  const standupCompleteTime = standupEndTime - standupStartTime;

  const hasDelay = standupCompleteTime > totalStandupTime;

  const statusText = (<i
    className={classNames("fa white", {"fa-thumbs-up": !hasDelay, "fa-thumbs-down": hasDelay})}
    aria-hidden="true"></i>);
    
  function handleRestartStandup() {
    dispatch({
      type: ACTIONS.CHANGE_VIEW,
      view: VIEWS.ADD_MEMBERS,
      order: shuffle(order),
    });
  }

  return (
    <>
      <ul className="flex flex-column">
        <li className="mv2">
          <span className="b mr2 underline">Total Standup time:</span>
          <span>{" "}{prettyMilliseconds(totalStandupTime, { verbose: true })}</span>
        </li>
        <li className="mv2">
          <span className="b mr2 underline">Standup Completed in:</span>
          <span>
            {" "}
            {prettyMilliseconds(standupCompleteTime, { verbose: true })}
            {" "}
            {statusText}
          </span>          
        </li>
      </ul>
      <Button onClick={handleRestartStandup}>Restart Standup</Button>
    </>
  );
};
