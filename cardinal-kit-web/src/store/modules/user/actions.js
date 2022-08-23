import request from "@/Rest";
import { usersRolesPaths, usersPaths, studiesPaths } from "@/common/static_data/api_routes"
import { auth } from "@/plugins/firebase/firebase"

export function reset({commit}){
    commit('RESET')
}

export const FetchUserRolesAndStudies= async ({commit})=>{
    return new Promise(function(resolve,reject){
        auth.onAuthStateChanged(async function (user){
            if(user){
                const userSnap = await request.GET(usersRolesPaths.get(user.uid)).Execute()
                if(userSnap.exists){
                    if(userSnap.data().rol=="doctor"){
                        if(userSnap.data().studies.length==1){
                            let allUsers = [];
                            const usersSnap = await request.GET(usersPaths.list(userSnap.data().studies[0])).Execute();
                            allUsers = usersSnap.docs.map((record) => {
                            return {id:record.id,...record.data()}
                            })
                        }
                        commit("saveUserRol",{...userSnap.data(),id:user.uid})
                    }
                    else if(userSnap.data().rol=="superAdmin"){
                        const studiesSnap = await request.GET(studiesPaths.list).Execute()
                        let studies = []
                        studiesSnap.docs.forEach(element => {
                            studies.push(element.id)
                        });
                        commit("saveUserRol",{rol:"superAdmin",studies:studies,id:user.uid})
                    }
                    else{
                        commit("saveUserRol",{...userSnap.data(),id:user.uid})
                    }
                }
                resolve()
            }
            else{
                commit("saveUserRol",{rol:"NoAccess",studies:[],id:''})
                resolve()
            }
        })
    })
    
}