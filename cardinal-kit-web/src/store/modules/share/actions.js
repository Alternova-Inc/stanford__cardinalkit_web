import request from "@/Rest"
import { usersRolesPaths, usersPaths } from "@/common/static_data/api_routes"
import { auth } from "@/plugins/firebase/firebase"

export const FetchUserHaveMyData = async ({ commit }) => {
    auth.onAuthStateChanged(async function (user){
        let users = []
        const usersSnap = await request.GET(usersRolesPaths.list()).WHERE(["users_access", "array-contains", user.uid]).Execute()
        usersSnap.forEach(user => {
            users.push({
                id: user.id,
                ...user.data()
            })
        });
        commit("saveUsersHaveMyData",users)
    })
    
}

// .collection("users_roles")
// .where("users_access", "array-contains", "eetPw3yVxig1Mkcp7ltGUHSXOHa2")
export const FetchUsersIHaveAccessTo = async ({commit}) =>{
    auth.onAuthStateChanged(async function (user){
        let users = []
        const usersSnap = await request.GET(usersRolesPaths.get(user.uid)).Execute()
        if(usersSnap.data()["user_data"]){
            for(const [key,value] of Object.entries(usersSnap.data()["user_data"])){
                users.push({
                    id:key,
                    email:value.email,
                    studyId:value.studyId
                })
            }
        }
        commit("saveUserIHaveAccess",users)
    })
}

export const FetchAllDoctorsAndSuperAdmin = async ({commit})=>{
    let users = []
    const usersSnap = await request.GET(usersRolesPaths.list()).WHERE(["rol", "in",['doctor','superAdmin']]).Execute()
    await auth.onAuthStateChanged(async function (user){
        usersSnap.forEach(admin => {
            let push=true
            if( admin.data() && admin.data()["users_access"]){
                if (admin.data()["users_access"].includes(user.uid)){
                    push=false
                }
            }
            if(push){
                users.push({
                    id: admin.id,
                    ...admin.data()
                })
            }
        
        });
        
        commit("saveDoctorsAdmin",users)
    })
}

export const ShareMyData = async ({commit},{userId,studyId})=>{
    return new Promise((resolve,reject)=>{
        auth.onAuthStateChanged(async function (user){
            const usersSnap = await request.GET(usersRolesPaths.get(userId)).Execute()
            const userDataSnap = await request.GET(usersPaths.get(studyId,user.uid)).Execute()
            let email = userDataSnap.data()['email']
            let previousUserAccess = []
            let data= usersSnap.data()
            if (data && data['users_access']){
                previousUserAccess = [...data['users_access']]
            }
            previousUserAccess.push(user.uid)

            let previousUserData = {}
           
           if (data && data['user_data']){
            previousUserData = { ...data['user_data']}
           }
           previousUserData[user.uid] = {
               'email':email,
               'studyId':studyId
           }
            await request.PUT(usersRolesPaths.get(userId),{
                data:{
                    'users_access':previousUserAccess,
                    'user_data':previousUserData
                }
            }).Execute()
            resolve()
        })
        
    })
}

export const RemoveAccess = async({commit}, userId)=>{
    return new Promise((resolve,reject)=>{
        auth.onAuthStateChanged(async function (user){
            let previousUserAccess = []
            const usersSnap = await request.GET(usersRolesPaths.get(userId)).Execute()
            let data= usersSnap.data()
            if (data && data['users_access']){
                previousUserAccess = [...data['users_access']]
            }
            var filteredAccess = previousUserAccess.filter(function(value, index, arr){ 
                return value!=user.uid;
            });
            let userData = {}
            if (data && data['user_data']){
                userData = {...data['user_data']}
                if(userData[user.uid]){
                    delete userData[user.uid]
                }
                
            }
            await request.PUT(usersRolesPaths.get(userId),{
                data:{
                    'users_access':filteredAccess,
                    'user_data':userData
                }
            }).Execute()
            resolve()
        })
    })
   
}