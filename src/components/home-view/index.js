import React, { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { AppContext } from "components/app-context";
import { ACTIONS } from "actions";
import shuffle from "lodash.shuffle";
import prettyMilliseconds from "pretty-ms";
import {
  addTeamMemberToLocalStorage,
  removeTeamMemberFromLocalStorage
} from "utils";

export function TeamMembers() {
  const [name, setName] = useState("");
  const [state = {}, dispatch] = useContext(AppContext);
  const { teamMembers = {} } = state;

  function handleNameChange(ev) {
    setName(ev.target.value);
  }
  function updateTeamMembers(teamMembers) {
    const count = Object.values(teamMembers).length;
    const timePerMember = count > 0 
    ? Math.floor(state.totalStandupTime / count)
    : 0;
    const ids = Object.keys(teamMembers);
    dispatch({
      type: ACTIONS.UPDATE_TEAM_MEMBERS,
      timePerMember,
      order: shuffle(ids),
      teamMembers
    });
  }

  function handleAddTeamMember(ev) {
    ev.preventDefault();
    const id = uuidv4();
    const completed = false;
    let teamMembers = addTeamMemberToLocalStorage({id, name, completed});
    setName("");
    updateTeamMembers(teamMembers);
  }

  function handleRemoveTeamMember(id) {
    const teamMembers = removeTeamMemberFromLocalStorage(id);
    updateTeamMembers(teamMembers);
  }

  const members = Object.values(teamMembers);
  let buttonText = "Start standup";
  if(members.length > 0) {
    buttonText = `${buttonText} with ${members.length} member${members.length === 1 ? "" : "s"}`;
  }
  return (
    <div className="flex flex-column items-start justify-center ba b--white pa4">
      <div className="f1 center mb4">
        Standup 
        <span
          role="img"
          aria-label="shuffle"
          className="fa fa-random bg-purple white mr2 ml2 pa2"
          aria-hidden="true">
        </span>
        Shuffle
      </div>
      <form
        onSubmit={handleAddTeamMember}
        className="flex items-start justify-center flex-nowrap w-100"
      >
        <input
          type="text"
          className="pa2 input-reset ba measure mr2 flex-auto pointer"
          placeholder="team member name"
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
      <div className="mv2 flex">
        <span className="b mr2 underline">Total Standup Time:</span>
        <span className="mr2">
          {prettyMilliseconds(state.totalStandupTime, { verbose: true })}
        </span>
        <span className="b mr2 underline">Time per member:</span>
        <span className="mr2">
          {prettyMilliseconds(state.timePerMember, { verbose: true })}
        </span>
      </div>
      {/* h5 overflow-y-auto w-100 */}
      <ul className="pl0 list">
        {members.map((member) => {
          return (
            <li className="mb2 pv1 flex items-center justify-start" key={member.id}>
              <span
                onClick={() => {handleRemoveTeamMember(member.id)}} 
                role="img"
                aria-label={`remove ${member.name}`}
                className="mr3 pointer fa fa-times bg-purple white pa1"
                aria-hidden="true"
                title={`remove ${member.name}`}
                >
              </span>
              <span>{member.name}</span>
            </li>
          );
        })}
      </ul>
      <button className="f6 link dim br1 ph3 pv2 mb2 dib white bg-purple center pointer">
        {buttonText}
      </button>
    </div>
  );
}
