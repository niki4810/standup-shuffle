import {ACTIONS} from "actions";
import {VIEWS} from "enums";

export const initialState = {
  teamMembers: {},
  order: [],
  totalStandupTime: 120000,
  timePerMember: 0,
  currentView: VIEWS.ADD_MEMBERS
};

export function rootReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SHUFFLE_MEMBERS: {
      return {
        ...state,
        order: action.order
      };
    }
    case ACTIONS.CHANGE_VIEW: {
      return {
        ...state,
        currentView: action.view
      };
    }
    case ACTIONS.UPDATE_TEAM_MEMBERS: {
      return {
        ...state,
        order: action.order,
        teamMembers: action.teamMembers,
        timePerMember: action.timePerMember,
      };
    }
    default:
      return state;
  }
}