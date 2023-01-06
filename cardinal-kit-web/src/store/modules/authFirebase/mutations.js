import {initialState} from './index'

export function RESET(state){
    const newState= initialState();
    Object.keys(newState).forEach(key => {
        state[key] = newState[key]
    });
}

export function error(state,errorMessage){
    state.error = true
    state.errorMessage = errorMessage
}

export function cleanErrors(state){
    state.error = false
    state.errorMessage = ""
}

export function isLogged(state,isLogged){
    localStorage.setItem('logged',isLogged)
    state.isLogged=isLogged
}