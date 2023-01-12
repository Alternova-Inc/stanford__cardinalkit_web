import State from "./state"

export function RESET(state){
    Object.keys(State).forEach(key => {
        state[key] = State[key]
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