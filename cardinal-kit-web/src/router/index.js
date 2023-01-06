import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/auth/login";
import SignUp from "@/views/auth/signUp";
import StudiesList from "@/views/studies/studiesList";
import PatientsList from "@/views/studies/patientsList";
import HealthUser from "@/views/patients/healthKit/healthKitUser";
import categoryDetail from "@/views/patients/healthKit/categoryDetail";
import registerDoctor from "@/views/auth/registerDoctor"
import surveysList from "@/views/surveys/surveysList"
import surveyDetail from "@/views/surveys/surveysDetail"
import surveyUser from "@/views/surveys/surveyUser"
import surveyScheduler from '@/views/surveys/surveyScheduler'
import store from "@/store";
import surveysBuilder from "@/views/surveys/surveysBuilder"
import editSurveyBuilder from "@/components/surveys/SurveyBuilder/editSurveyBuilder.vue"
import categories from '@/components/patients/healthKit/categoryList'
import healthKitGraphs from '@/views/patients/healthKit/healthKitGraphs'
import shareHome from '@/views/share/shareHome'


const routes = [
  {
    path: "/",
    name: "Home",
    redirect: "/studies",
    component: () => import('@/common/layout/Main'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "/studies",
        name: "studies",
        component: StudiesList,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/patients/:studyId",
        name: "patients",
        component: PatientsList,
        props: true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/healthKitUser",
        name: "healthUser",
        component: HealthUser,
        meta: {
          requiresAuth: true,
        },
        props: true,
        redirect: {name: "categories"},
        children: [
          { 
            name: "categories", path: '', component: categories,
          },
          { 
            name: "category", path: 'category/:categoryId', component: categoryDetail 
          },
          { 
            name: "statistic", path: 'statistic/:hkCode', component: healthKitGraphs 
          }
        ]
      },
      {
        path: "/healthGraph/:studyId/:userId/:hkCode",
        name: "healthGraph",
        component: () => import('@/views/patients/healthKit/healthKitGraphs'),
        props: true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/categoryDetail/:studyId/:userId/:categoryId",
        name: "categoryDetail",
        component: categoryDetail,
        props:true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/register",
        name: "register",
        component: registerDoctor,
        props:true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/surveysList/:studyId",
        name: "surveysList",
        component: surveysList,
        props:true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/surveyDetail/:studyId/:surveyId",
        name: "surveyDetail",
        component: surveyDetail,
        props:true,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "/surveysBuilder/:studyId",
        name: "surveysBuilder",
        component: surveysBuilder,
        props:true,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "/surveyScheduler/:studyId",
        name: "surveyScheduler",
        component: surveyScheduler,
        props:true,
        meta: {
          requiresAuth: true,
        }
      },
      {
        path: "/edit/surveyBuilder/:studyId/:surveyId",
        name: "editSurveyBuilder",
        component: editSurveyBuilder,
        props:true,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/surveyUser",
        name: "surveyUser",
        component: surveyUser,
        props:true,
        meta: {
          requiresAuth: true,
        },        
      },
      {
        path: "/share/:studyId",
        name: "share",
        component: shareHome,
        props:true,
        meta: {
          requiresAuth: true,
        },        
      },
    ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUp,
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  store.dispatch("user/FetchUserRolesAndStudies")
  if (process.env.VUE_APP_AUTH_MODE == "firebase") {
    let { auth } = require("@/plugins/firebase/firebase");
    let unsubscribe = auth.onAuthStateChanged(function(user){
        if (user) {
          if(to.name=="Login"){
            next({name:'Home'})
          }
          else{
            next()
          }
        } else {
          
          
          if (to.matched.some((record) => record.meta.requiresAuth && to.name!="Login")) {
            next({name:'Login'})
          }
          else{
            next()
          }
        }
        unsubscribe()
    });
  } else {

  }
});


export default router;
