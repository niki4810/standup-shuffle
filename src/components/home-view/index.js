import React, { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import classNames from "classnames";
import { AppContext } from "components/app-context";
import { ACTIONS } from "actions";
import { VIEWS } from "enums";
import shuffle from "lodash.shuffle";
import prettyMilliseconds from "pretty-ms";
import parseMilliSeconds from "parse-ms";
import toMilliseconds from "@sindresorhus/to-milliseconds";
import {
  addTeamMemberToLocalStorage,
  removeTeamMemberFromLocalStorage,
} from "utils";
import { Button } from "components/button";

export function TeamMembers() {
  const [name, setName] = useState("");
  const [state = {}, dispatch] = useContext(AppContext);
  const { teamMembers = {} } = state;

  function handleNameChange(ev) {
    setName(ev.target.value);
  }

  function updateTeamMembers(teamMembers) {
    const count = Object.values(teamMembers).length;
    const timePerMember =
      count > 0 ? Math.floor(state.totalStandupTime / count) : 0;
    const ids = Object.keys(teamMembers);
    dispatch({
      type: ACTIONS.UPDATE_TEAM_MEMBERS,
      timePerMember,
      order: shuffle(ids),
      teamMembers,
    });
  }

  function handleAddTeamMember(ev) {
    ev.preventDefault();
    const id = uuidv4();
    const completed = false;
    let teamMembers = addTeamMemberToLocalStorage({ id, name, completed });
    setName("");
    updateTeamMembers(teamMembers);
  }

  function handleRemoveTeamMember(id) {
    const teamMembers = removeTeamMemberFromLocalStorage(id);
    updateTeamMembers(teamMembers);
  }

  function handleStartStandup() {
    dispatch({
      type: ACTIONS.CHANGE_VIEW,
      view: VIEWS.START_STANDUP,
      standupStartTime: Date.now(),
    });
  }

  function handleStandupTimeChange(ev) {
    const { target } = ev;
    let { value } = target;
    value = !value || value === "" ? 2 : value;
    const totalStandupTime = toMilliseconds({ minutes: parseInt(value) });
    localStorage.setItem("totalStandupTime", totalStandupTime);
    const count = Object.values(teamMembers).length;
    const timePerMember = count > 0 ? Math.floor(totalStandupTime / count) : 0;
    dispatch({
      type: ACTIONS.SET_STANDUP_TIME,
      totalStandupTime,
      timePerMember,
    });
  }

  const members = Object.values(teamMembers);
  let buttonText = "Start standup";
  if (members.length > 0) {
    buttonText = `${buttonText} with ${members.length} member${
      members.length === 1 ? "" : "s"
    }`;
  }

  const timeInMins = parseMilliSeconds(state.totalStandupTime).minutes;

  return (
    <div className="flex flex-column items-start justify-center w-100">
      <form
        onSubmit={handleAddTeamMember}
        className="flex items-start justify-center-ns flex-nowrap-ns w-100"
      >
        <input
          type="text"
          className="pa2 input-reset ba measure mr2 flex-auto pointer"
          placeholder="team member name"
          value={name}
          onChange={handleNameChange}
        />
        <Button
          className={classNames({ disabled: !name || name === "" })}
          disabled={!name || name === ""}
        >
          <i className="fa fa-plus" aria-hidden="true"></i>
        </Button>
      </form>
      <div className="flex flex-row pv3 w-100">
        <div className="mr2 pr2 br b--white flex-auto">
          {/* h5 overflow-y-auto w-100 */}
          <div className="b underline">
            Members
            <i class="fa fa-users ml2" aria-hidden="true"></i>
          </div>
          <ul className="pl0 list">
            {members.length === 0 && (
              <div className="mb2 pv1">No members yet.</div>
            )}
            {members.map((member) => {
              return (
                <li
                  className="mb2 pv1 flex items-center justify-start"
                  key={member.id}
                >
                  <span
                    onClick={() => {
                      handleRemoveTeamMember(member.id);
                    }}
                    role="img"
                    aria-label={`remove ${member.name}`}
                    className="mr3 pointer fa fa-times bg-purple white pa1"
                    aria-hidden="true"
                    title={`remove ${member.name}`}
                  ></span>
                  <span>{member.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex pl2 flex-column">
          <div className="b mb3 underline">
            Settings
            <i class="fa fa-cog ml2" aria-hidden="true"></i>
          </div>
          <div className="mb3 i underline">Total Standup Time:</div>
          <div className="mb3">
            <input
              type="number"
              value={timeInMins}
              min={2}
              max={30}
              onChange={handleStandupTimeChange}
            />{" "}
            minutes.
          </div>
          <div className="mb3 i underline">Time per member:</div>
          <div className="mb3">
            {prettyMilliseconds(state.timePerMember, { verbose: true })}
          </div>
        </div>
      </div>
      <Button
        disabled={members.length === 0}
        className="center"
        onClick={handleStartStandup}
      >
        {buttonText}
      </Button>
    </div>
  );
}
