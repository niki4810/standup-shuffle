import {ACTIONS} from "actions";

export const initialState = {
  teamMembers: {},
  order: [],
  // totalStandupTime: 900000, // 15 mins (or) 900 seconds (or) 900,000 milli seconds
  totalStandupTime: 120000,
  timePerMember: 0,
};

export function rootReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT_TEAM_MEMBERS: {
      return {
        ...state,
        teamMembers: action.teamMembers,
        timePerMember: action.timePerMember,
        order: action.order,
      };
    }
    case ACTIONS.UPDATE_TEAM_MEMBERS: {
      return {
        ...state,
        timePerMember: action.timePerMember,
        order: action.order,
        teamMembers: action.teamMembers,
      };
    }
    default:
      return state;
  }
}