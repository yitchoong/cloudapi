var api= require('./index');
api.init()
.then(status => {
        console.log("status", status);
        api.getTenantList()
        .then(rows => {
            console.log("***** rows", rows);
        });
 });

