import React, { useState, useReducer, useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import shuffle from "lodash.shuffle";
import classNames from "classnames";

const AppContext = React.createContext();
const ACTIONS = {
  INIT_TEAM_MEMBERS: "INIT_TEAM_MEMBERS",
  ADD_TEAM_MEMBER: "ADD_TEAM_MEMBER",
};

function TeamMembers() {
  const [name, setName] = useState("");
  const [state = {}, dispatch] = useContext(AppContext);
  const { teamMembers = {} } = state;

  function handleNameChange(ev) {
    setName(ev.target.value);
  }
  function handleAddTeamMember(ev) {
    ev.preventDefault();
    const id = uuidv4();
    const completed = false;
    const type = ACTIONS.ADD_TEAM_MEMBER;
    const count = Object.values(state.teamMembers).length;
    const timePerMember = Math.floor(initialState.totalStandupTime / count + 1);
    let data = localStorage.getItem("teamMembers");
    if (data) {
      data = JSON.parse(data);
    }
    let teamMembers = { ...data, [id]: { name, completed, id } };
    localStorage.setItem("teamMembers", JSON.stringify(teamMembers));
    setName("");
    const ids = Object.keys(teamMembers);
    dispatch({ type, id, name, completed, timePerMember, order: shuffle(ids) });
  }
  return (
    <div className="flex flex-column">
      <form onSubmit={handleAddTeamMember}>
        <input
          type="text"
          className="pa2 input-reset ba  w-50 measure mr2"
          value={name}
          onChange={handleNameChange}
        />
        <button
          className={classNames(
            "f6 link dim br1 ph3 pv2 mb2 dib white bg-purple",
            { disabled: !name || name === "" }
          )}
          disabled={!name || name === ""}
        >
          Add Team Member
        </button>
      </form>
      <div className="ma2 flex">
        <span className="b mr2">Total Standup Time:</span>
        <span className="mr2">{state.totalStandupTime / 60000} minutes,</span>
        <span className="b mr2">Time per member:</span>
        <span className="mr2">{state.timePerMember / 60000} minutes</span>
      </div>
      <ul>
        {Object.values(teamMembers).map((member) => {
          return <li key={member.id}>{member.name}</li>;
        })}
      </ul>
    </div>
  );
}

function CurrentMember() {
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
function StartStandup() {
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

function rootReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_TEAM_MEMBERS: {
      return {
        ...state,
        teamMembers: action.teamMembers,
        timePerMember: action.timePerMember,
        order: action.order,
      };
    }
    case ACTIONS.ADD_TEAM_MEMBER: {
      return {
        ...state,
        timePerMember: action.timePerMember,
        order: action.order,
        teamMembers: {
          ...state.teamMembers,
          [action.id]: {
            id: action.id,
            name: action.name,
            completed: action.completed,
          },
        },
      };
    }
    default:
      return state;
  }
}

const initialState = {
  teamMembers: {},
  order: [],
  // totalStandupTime: 900000, // 15 mins (or) 900 seconds (or) 900,000 milli seconds
  totalStandupTime: 120000,
  timePerMember: 0,
};

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
    console.log(data);
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
