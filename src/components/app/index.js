import React, {
  useState,
  useReducer,
  useContext,
  useEffect 
} from "react";
import {AppContext} from "components/app-context";
import shuffle from "lodash.shuffle";
import {ACTIONS} from "actions";
import {rootReducer, initialState} from "store";
import {TeamMembers} from "components/home-view";
import {StartStandup} from "components/timer-view";
function App() {
  const store = useReducer(rootReducer, initialState);

  useState(() => {
    const data = localStorage.getItem("teamMembers");
    if (data) {
      const teamMembers = JSON.parse(data);
      const dispatch = store[1];
      const count = Object.values(teamMembers).length;
      const ids = Object.keys(teamMembers);
      const timePerMember = Math.floor(initialState.totalStandupTime / count);
      dispatch({
        type: ACTIONS.INIT_TEAM_MEMBERS,
        teamMembers,
        timePerMember,
        order: shuffle(ids),
      });
    }
  }, []);

  return (
    <div className="app pa4 mr2 flex">
      <AppContext.Provider value={store}>
        <div className="flex items-center justify-center">
          <TeamMembers />
          <StartStandup />
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
