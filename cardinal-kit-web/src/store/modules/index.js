const modules = {
    'user':require('./user').default ,
    'studies':require('./studies').default,
    'auth': (process.env.VUE_APP_AUTH_MODE == "firebase")? require('../../auth/services/authFirebase').default : require('../../auth/services/authApi').default,
    'patient':require('../../patients/services/patient').default,
    'units':require('./units').default,
    'surveys':require('./surveys').default,
    'share': require('./share').default
};
export default modules;