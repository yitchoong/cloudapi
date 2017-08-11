var submission =
{
    "submissionDate":"2017-06-14",
    "submissionType": "FirstPartyTermProposalSubmission",
    "tenantCode" : "ebao",
    "submissionChannel" : "agency",
    "submissionRefNo":"",
    "userId" : "ycloh",
    "submissionData": {
        "proposalType" : "FirstPartyIlp",
        "proposerName" : "Tan Ah Kow",
        "submissionChannel" : "agency",
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
                "postcode" : "437781",
                "state" : "Singapore"
            },
            "contactInfo" : {
                "homeTelNo" : "7827772020",
                "mobileNo" : "87882020",
                "email" : "tak20010@gmail.com"
            }
          },
        //   "lifeAssuredSection" : {
        //         "fullName" : "Lifeassured spouse",
        //         "birthCountry" : "165",
        //         "birthDate" : "1972-04-20",
        //         "idType" : "3",
        //         "idNumber" : "A228899",
        //         "nationality" : "299",
        //         "gender" : "Female",
        //         "pdpaConsent" : true,
        //         "occupation" : "2",
        //         "employmentNature" : "Accounting /Audit / Compliance/Risk",
        //         "mailingAddress" : {
        //             "addressLine1" : "24 Robinson Avenue",
        //             "country" : "165",
        //             "postcode" : "437781",
        //             "state" : "Singapore"
        //         },
        //         "contactInfo" : {
        //             "homeTelNo" : "7827773383",
        //             "mobileNo" : "87882220",
        //             "email" : "lifeassured.spouse@gmail.com"
        //         }
        // },
        "paymentSection" : {
            "initialPaymentMethod" : {"paymentMethod" : "Cash" },
            "renewalPaymentMethod" : {"paymentMethod" : "Cash" }
        },
        "proposedInsuranceSection" : {
            "startDate" : "2017-05-27",
            "insuredList" : [
                { "name" : "Tan Ah Kow", "birthDate":"1980-02-28", "gender" : "MALE", "smoking" :"NON-SMOKER", "occupation" : "2" },
                { "name" : "Life assured", "birthDate":"1978-02-28", "gender" : "FEMALE", "smoking" :"NON-SMOKER", "occupation" : "2" }
            ],
            "coverageList" : [{
                    "productId" : 5722,
                    "productCode" : "IFLE03",
                    "productName" : "Flexi-Link",
                    "packageCode" : "",
                    "lifeAssuredNumber": 1,
                    "sumAssured" : 200000000,
                    // "coverageTermType" : "2",
                    // "coverageTermValue" : 5,
                    // "premiumTermType" : "2",
                    // "premiumTermValue" : 5,
                    "targetPremium" : 3000000,
                    "regularTopup" : 5000000,
                    "currency" : "30",
                    "paymentMode" : "4",
                    "monthlyCostOfInsurance" : 123.20
                    // "firstYearPremium" : 0,
                    // "premiumAmount" : 0
                }],
            "topupList" : [{"year": 3, "amount": 500000}],
            "withdrawalList" : [{"year": 10, "amount": 2000000}],
            "fundList" : [
                {"fundCode" : "AER", "fundName" : "ABC Equity Fund", "allocation": 80},
                {"fundCode" : "AFR", "fundName" : "ABC Fixed Income Fund", "allocation" : 20 }
            ]
        },
        "policyholderDisclosureSection" : {}
        //     "disclosures": {
        //         "10" : { "label":"Height", "value": 170},
        //         "20" : {"label": "Weight", "value": 80},
        //         "30" : {"label": "Do you smoke?" , "value": "yes"},
        //         "30-10": {"label": "Type" , "value" : "CI" },
        //         "30-20" : {"label":"How many stcks per day", "value": "10"},
        //         "30-30" : {"label": "How Long? (yrs)" , "value": 2},
        //         "40" :  {"label":"Do you have disability or treated for conditions?", "value" : "yes"},
        //         "40-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
        //         "40-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
        //         "40-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
        //         "40-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
        //         "40-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},
        //
        //         "50" :  {"label":"Do you have applications?", "value" : "yes"},
        //         "50-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
        //         "50-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
        //         "50-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
        //         "50-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
        //         "50-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},
        //
        //         "60" :  {"label":"Have you had surgery / treatment in the last 2 years?", "value" : "yes"},
        //         "60-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
        //         "60-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
        //         "60-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
        //         "60-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
        //         "60-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},
        //
        //         "70" :  {"label":"Are you waiting for medical treatment?", "value" : "yes"},
        //         "70-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
        //         "70-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
        //         "70-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
        //         "70-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
        //         "70-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},
        //
        //         "80" :  {"label":"Have you been taking drugs?", "value" : "yes"},
        //         "80-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
        //         "80-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
        //         "80-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
        //         "80-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
        //         "80-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},
        //
        //         "90" :  {"label":"Have either of your direct family member (parents, brothers and sisters)....?", "value" : "Yes"},
        //         "90-10" : {"label": "relationship", "multiValues": ["BR","SI"]},
        //         "90-20" : {"label": "condition/ cause of death", "multiValues": ["XRAY", "ECG"]},
        //         "90-30" : {"label": "Age of onset", "multiValues": [60, 0]},
        //         "90-40" : {"label": "Age at death", "multiValues": [0, 87]}
        //     }
        // },
        "lifeAssuredDisclosureSection" : {
            "disclosures": {
                "10" : { "label":"Height", "value": 170},
                "20" : {"label": "Weight", "value": 80},
                "30" : {"label": "Do you smoke?" , "value": "yes"},
                "30-10": {"label": "Type" , "value" : "CI" },
                "30-20" : {"label":"How many stcks per day", "value": "10"},
                "30-30" : {"label": "How Long? (yrs)" , "value": 2},
                "40" :  {"label":"Do you have disability or treated for conditions?", "value" : "yes"},
                "40-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
                "40-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
                "40-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
                "40-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
                "40-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},

                "50" :  {"label":"Do you have applications?", "value" : "yes"},
                "50-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
                "50-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
                "50-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
                "50-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
                "50-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},

                "60" :  {"label":"Have you had surgery / treatment in the last 2 years?", "value" : "yes"},
                "60-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
                "60-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
                "60-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
                "60-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
                "60-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},

                "70" :  {"label":"Are you waiting for medical treatment?", "value" : "yes"},
                "70-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
                "70-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
                "70-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
                "70-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
                "70-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},

                "80" :  {"label":"Have you been taking drugs?", "value" : "yes"},
                "80-10" : {"label": "Date", "multiValues": ["2017-01-05","2017-06-03"]},
                "80-20" : {"label": "Type of diagnostic", "multiValues": ["XRAY", "ECG"]},
                "80-30" : {"label": "Hospital/Clinic", "multiValues": ["Assunta", "KPJ PJ"]},
                "80-40" : {"label": "Address", "multiValues": ["PJ 222", "Damansara Kim"]},
                "80-50" : {"label": "Remarks", "multiValues": ["Clean", "Clean"]},

                "90" :  {"label":"Have either of your direct family member (parents, brothers and sisters)....?", "value" : "Yes"},
                "90-10" : {"label": "relationship", "multiValues": ["BR","SI"]},
                "90-20" : {"label": "condition/ cause of death", "multiValues": ["XRAY", "ECG"]},
                "90-30" : {"label": "Age of onset", "multiValues": [60, 0]},
                "90-40" : {"label": "Age at death", "multiValues": [0, 87]}
            }
        }
    }

}

var proposal = submission.submissionData
proposal.pk = 1
proposal.version = 1
proposal.proposerName = 'Updated'

var api = require("./index")

function run() {
    var dbapi = require("crud-api");
    dbapi.init()
    .then( status => {
        // let res = api.validateFirstPartySubmission(submission)
        // console.log(res)

        //  api.processFirstPartyTraditionalProposalSubmission(submission)
         //api.processThirdPartyIlpProposalSubmission(submission)
        //  api.newFirstPartyTraditionalProposal(proposal)
        //  api.updateFirstPartyIlpProposal(proposal)
        api.verifyAndSubmitThirdPartyTraditionalProposal(5,2,'default','ebao')
         .then(result => console.log("response ===>", result))
         .catch((err) => console.log("****-- error ---***", err))

        // api.fetchFirstPartyTermSubmissionSummaryList()
        // .then(result => console.log("result -", result))

    })
    .catch((err) => console.log("---error---", err))
}
setTimeout(run, 500)
