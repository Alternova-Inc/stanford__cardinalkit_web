import {initialState} from './index'

export function RESET(state){
    const newState= initialState();
    Object.keys(newState).forEach(key => {
        state[key] = newState[key]
    });
}

export function saveStudies(state,studies){
    state.studies=studies
}

export function saveRecords(state,records){
    state.records=records
}

export function SaveUsers(state,{idStudy,users}){
    state.users[idStudy]=users
}

export function saveUsersMonthUsage(state,monthUsage){
    state.monthUserUsage=monthUsage
}