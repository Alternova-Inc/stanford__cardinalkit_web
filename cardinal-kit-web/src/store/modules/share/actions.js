import request from "@/Rest"
import { objectToString } from "@vue/shared";

export const FetchUserHaveMyData = async ({ commit }) => {
    let { auth } = require("@/plugins/firebase/firebase");
    auth.onAuthStateChanged(async function (user){
        console.log(user.uid)
        let users = []
        const usersSnap = await request.GET("users_roles").WHERE(["users_access", "array-contains", user.uid]).Execute()
        usersSnap.forEach(user => {
            users.push({
                id: user.id,
                ...user.data()
            })
        });
        console.log("users",users)
        commit("saveUsersHaveMyData",users)
    })
    
}

// .collection("users_roles")
// .where("users_access", "array-contains", "eetPw3yVxig1Mkcp7ltGUHSXOHa2")
export const FetchUsersIHaveAccessTo = async ({commit}) =>{
    let { auth } = require("@/plugins/firebase/firebase");
    auth.onAuthStateChanged(async function (user){
        let users = []
        const usersSnap = await request.GET(`users_roles/${user.uid}`).Execute()
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
    let { auth } = require("@/plugins/firebase/firebase");
    let users = []
    const usersSnap = await request.GET("users_roles").WHERE(["rol", "in",['doctor','superAdmin']]).Execute()
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
        let { auth } = require("@/plugins/firebase/firebase");
        auth.onAuthStateChanged(async function (user){
            const usersSnap = await request.GET(`users_roles/${userId}`).Execute()
            const userDataSnap = await request.GET(`studies/${studyId}/users/${user.uid}`).Execute()
            console.log(userDataSnap.data())
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
           console.log('data',previousUserData)
            await request.PUT(`/users_roles/${userId}/`,{
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
        let { auth } = require("@/plugins/firebase/firebase");
        auth.onAuthStateChanged(async function (user){
            let previousUserAccess = []
            const usersSnap = await request.GET(`users_roles/${userId}`).Execute()
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
            await request.PUT(`/users_roles/${userId}/`,{
                data:{
                    'users_access':filteredAccess,
                    'user_data':userData
                }
            }).Execute()
            resolve()
        })
    })
   
}