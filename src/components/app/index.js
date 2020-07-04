import React, { useState, useReducer} from "react";
import { AppContext } from "components/app-context";
import shuffle from "lodash.shuffle";
import { ACTIONS } from "actions";
import { VIEWS } from "enums";
import { rootReducer, initialState } from "store";
import { TeamMembers } from "components/home-view";
import { StartStandup } from "components/timer-view";
import {SummaryView} from "components/summary-view";

function App() {
  const store = useReducer(rootReducer, initialState);
  const [state] = store;

  useState(() => {
    const data = localStorage.getItem("teamMembers");
    if (data) {
      const teamMembers = JSON.parse(data);
      const dispatch = store[1];
      const count = Object.values(teamMembers).length;
      const ids = Object.keys(teamMembers);
      const timePerMember =
        count > 0 ? Math.floor(initialState.totalStandupTime / count) : 0;
      dispatch({
        type: ACTIONS.UPDATE_TEAM_MEMBERS,
        teamMembers,
        timePerMember,
        order: shuffle(ids),
      });
    }
  }, []);

  const { currentView = VIEWS.ADD_MEMBERS } = state;

  let child;
  switch (currentView) {
    case VIEWS.SUMMARY:
      child = <SummaryView />;
      break;
    case VIEWS.START_STANDUP:
      child = <StartStandup />;
      break;
    default:
      child = <TeamMembers />;
  }

  return (
    <div className="app pa4 mr2 flex">
      <AppContext.Provider value={store}>
        <div className="flex flex-column items-center justify-center ba b--white pa4">
          <div className="f1 center mb4 bb b--white pb3">
            Standup
            <span
              role="img"
              aria-label="shuffle"
              className="fa fa-random bg-purple white mr2 ml2 pa2"
              aria-hidden="true"
            ></span>
            Shuffle
          </div>
          {child}
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
