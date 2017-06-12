var api = require('./index')

function run() {
    var dbapi = require('crud-api');
    dbapi.init()
    .then( status => {
//         api.fetchSubmissionSummaryList([ [{key:'pk',oper:'eq',value:1},{key:'submissionChannel',oper:'eq',value:'directx'}],[{key:'submissionType',oper:'eq',value:'FirstPartyMedicalProposal'}]])
         api.fetchFirstPartyMedicalSubmissionSummaryList('ycloh','FirstPartyMedicalSubmission',[[{key:"submissionChannel",oper:'eq', value:"39"}]])
         .then(result => console.log("result ===>", result))
         .catch((err) => console.log("****-- error ---***", err))
    });
}
setTimeout(run, 500)
