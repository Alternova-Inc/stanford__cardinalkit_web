const modules = {
    'user':require('./user').default ,
    'studies':require('./studies').default,
    'auth': (process.env.VUE_APP_AUTH_MODE == "firebase")? require('./authFirebase').default:require('./authApi').default,
    'patient':require('./patient').default,
    'units':require('./units').default,
    'surveys':require('./surveys').default,
    'share': require('./share').default
};
export default modules;