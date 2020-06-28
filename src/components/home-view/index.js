import React, {useState, useContext} from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import {AppContext} from "components/app-context";
import {initialState} from "store";
import {ACTIONS} from "actions";
import shuffle from "lodash.shuffle";
import prettyMilliseconds from "pretty-ms";

export function TeamMembers() {
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
        <span className="mr2">{prettyMilliseconds(state.totalStandupTime, {verbose: true})}</span>
        <span className="b mr2">Time per member:</span>
        <span className="mr2">{prettyMilliseconds(state.timePerMember, {verbose: true})}</span>
      </div>
      <ul>
        {Object.values(teamMembers).map((member) => {
          return <li key={member.id}>{member.name}</li>;
        })}
      </ul>
    </div>
  );
}