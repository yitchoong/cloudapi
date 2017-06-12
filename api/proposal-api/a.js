var proposal = {
    "proposalType" : "FirstPartyMedical",
    "proposerName" : "Tan Ah Kow",
    "submissionChannel" : "direct",
    "tenantCode" : "ebao",
    "promotionCode" : "one4one",
    "policyholderSection" : {
        "fullName" : "Tan Ah Kow",
        "birthCountry" : "165",
        "birthDate" : "1970-04-20",
        "idType" : "3",
        "idNumber" : "A7827738",
        "nationality" : "299",
        "gender" : "Male",
        "pdpaConsent" : true,
        "occupation" : "2",
        "employmentNature" : "Accounting /Audit / Compliance/Risk",
        "insuranceObjective" : "PRO",
        "mailingAddress" : {
            "addressLine1" : "24 Robinson Avenue",
            "country" : "165",
            "postcode" : 437781,
            "state" : "Singapore"
        },
        "contactInfo" : {
            "homeTelNo" : "7827773382",
            "mobileNo" : "87882209",
            "email" : "ahkowtan@gmail.com"
        }
    },
    "premiumPaymentSection" : {
        "initialPaymentMethod" : "PaymentGatewayRecurringPayment",
        "subsequentPaymentMethod" : "PaymentGatewayRecurringPayment"
    },
    "proposedInsuranceSection" : {
        "startDate" : "2017-05-27",
        "insuredList" : [
            {"name" : "Tan Ah Kow", "birthDate" : "1970-04-20", "gender" : "MALE", "smoking" :"NON-SMOKER", "occupation" : "2"}
        ],
        "productList" : [
            {
                "productId" : 7202,
                "productCode" : "MHCP",
                "productName" : "Main Hospital Cash Plan",
                "packageCode" : null,
                "lifeAssuredNumber": 0,
                "benefitLevel" : "3",
                "coverageTermType" : "2",
                "coverageTermValue" : 5,
                "premiumTermType" : "2",
                "premiumTermValue" : "5",
                "currency" : "8",
                "paymentMode" : "4",
                "firstYearPremium" : 1250,
                "premiumAmount" : 132
            }
        ]
    }
}

var api = require('./index')

function run() {
    var json  = {submissionDate:'2017-06-08',submissionType: 'FirstPartyMedicalProposal', tenantCode:"ebao", submissionChannel: "direct", submissionRefNo:"678", submissionData: proposal }
    var dbapi = require('crud-api');
    dbapi.init()
    .then( status => {
         api.processFirstPartyMedicalProposalSubmission(json)
         .then(result => console.log("result ===>", result))
         .catch((err) => console.log("****-- error ---***", err))
    });
}
setTimeout(run, 500)
