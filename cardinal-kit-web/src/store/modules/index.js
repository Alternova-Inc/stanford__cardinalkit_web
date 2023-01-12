const modules = {
    'user':require('./user').default ,
    'studies':require('./studies').default,
    'patient':require('./patient').default,
    'units':require('./units').default,
    'surveys':require('./surveys').default,
    'share': require('./share').default
};

export default modules;