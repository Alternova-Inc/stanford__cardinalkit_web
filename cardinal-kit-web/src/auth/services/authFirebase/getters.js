export function getError(state){
  return {
    error: state.error,
    errorMessage: state.errorMessage
  }
}

export function getUserIsLogged(state) {
    return state.isLogged
  }