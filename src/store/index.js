import {ACTIONS} from "actions";
import {VIEWS} from "enums";

export const initialState = {
  teamMembers: {},
  order: [],
  standupStartTime: null,
  standupEndTime: null,
  totalStandupTime: 120000,
  timePerMember: 0,
  currentView: VIEWS.ADD_MEMBERS
};

export function changeViewReducer(state, action) {
  switch(action.view) {
    case VIEWS.ADD_MEMBERS: {
      return {
        ...state,
        order: action.order || state.order,
        currentView: action.view,
        standupStartTime: initialState.standupStartTime,
        standupEndTime: initialState.standupEndTime
      };
    }
    case VIEWS.START_STANDUP: {
      return {
        ...state,
        currentView: action.view,
        standupStartTime: action.standupStartTime
      }
    }
    case VIEWS.SUMMARY: {
      return {
        ...state,
        currentView: action.view,
        standupEndTime: action.standupEndTime
      };
    }
    default: {
      return state;
    }
  }
}

export function rootReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STANDUP_TIME: {
      return {
        ...state,
        totalStandupTime: action.totalStandupTime,
        timePerMember: action.timePerMember
      };
    }
    case ACTIONS.SHUFFLE_MEMBERS: {
      return {
        ...state,
        order: action.order
      };
    }
    case ACTIONS.CHANGE_VIEW: {
      return changeViewReducer(state, action);
    }
    case ACTIONS.UPDATE_TEAM_MEMBERS: {
      return {
        ...state,
        order: action.order,
        teamMembers: action.teamMembers,
        timePerMember: action.timePerMember,
        totalStandupTime: action.totalStandupTime || state.totalStandupTime
      };
    }
    default:
      return state;
  }
}