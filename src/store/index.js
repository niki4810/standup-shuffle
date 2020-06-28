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