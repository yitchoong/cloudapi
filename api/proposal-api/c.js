
var api = require("./index")

function run() {
    var dbapi = require("crud-api");
    dbapi.init()
    .then( status => {
         api.deleteThirdPartyIlpProposal(13,2,'default')
         .then(result => console.log("result ===>", result))
         .catch((err) => console.log("****-- error ---***", err))
    })
    .catch((err) => console.log("---error---", err))
}
setTimeout(run, 500)
