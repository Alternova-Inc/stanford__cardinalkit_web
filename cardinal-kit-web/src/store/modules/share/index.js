import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

export const initialState = () => ({
    usersHaveMyData:[],
    doctorsAdmin:[],
    usersIHaveAccess:[]
})

export default {
    namespaced:true,
    state:initialState(),
    mutations,
    actions,
    getters
}
