import {initialState} from './index'

export function RESET(state){
    const newState= initialState();
    Object.keys(newState).forEach(key => {
        state[key] = newState[key]
    });
}

export function saveUsersHaveMyData(state,users){
    state.usersHaveMyData = users
}

export function saveDoctorsAdmin(state,users){
    state.doctorsAdmin=users
}

export function saveUserIHaveAccess(state,users){
    state.usersIHaveAccess = users
}