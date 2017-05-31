'use strict'

let exp = {}

exp.tagListMapper = {
  pk : "tagId",
  labelName: "tagName",
  labelPic: "tagPic"
}
exp.coveragePeriodMapper = {
  period : "coverageType",
  year: "coverageValue",
}
exp.premiumPaymentTermMapper = {
  period : "termType",
  year: "termValue",
}
exp.highlightsMapper = {
  pk : "displayOrder",
  rightWords: "description",
}
exp.liabilityMapper = {
  liabCategory: "liabType",
  pk: "liabId",
  liabId: "liabId",
  liabName : "liabName",
  categoryName: "categoryName",
  liabDesc: "liabDesc",
  ifDisplayInQuoteillus : "ifDisplayInIllustration",
  liabDescQuote: "liabDescQuote",
  liabCalcType: "liabCalcType",
  liabCalcMethod: "liabCalcMethod",
  diseaseDesc: "diseaseDesc"
}
exp.insurerMapper = {
    pk: "pk",
    insurerId : "insurerId",
    companyName: "insurerName",
    abbrName : "shortName",
    organDesc: "insurerDescription",
    organLogo: "logo",
    telephone: "telephone",
    url : "url",
    organProposalrule : "underwritingRule"
}
exp.featureMapper = {
  listId: "featureId",
  featurePic: "featurePic",
  pk : "displayOrder",
}
exp.packageProductMapper = {
  packageId: "packageId",
  productId: "productId",
  packageProductName : "packageProductName",
  insType : "insType",
  version: "version",
  doctype: "doctype",
  liabilityDiseaseInfo: "liabilityDiseaseInfo",
  liabilityList: "liabilityList",
  exclusionList: "exclusionList",
  underwritingRuleList: "underwritingRuleList",
  caseInfoList: "caseInfoList",
  diseaseList: "diseaseList",
  clauseList: "clauseList",
  fundAndChargesList: "fundAndChargesList",
  packageCode: "packageCode"
}
exp.productAttachableRiderMapper = {
  attachId: "attachId",
  masterId: "productId",
  riderName : "attachedProductName",
  attachCompulsory : "compulsory",
}
exp.productLifeMapper = {
  internalId : "productCode",
  insType: "insType",
  unitFlag: "unitFlag",
  insurer: "insurer",
  sumAssuredLimitList: "sumAssuredLimitList",
  ageLimitList: "ageLimitList",
  premiumLimitList: "premiumLimitList",
  benefitLevelList: "benefitLevelList",
  liabilityList: "liabilityList",
  ageRange: "ageRange",
  pointToPh: "pointToPh",
  pointToSecInsured: "pointToSecInsured",
  smokingIndi: "smokingIndi",
  jobIndi: "jobIndi",
  socialInsuranceIndi: "socialInsuranceIndi",
  isWaiver: "isWaiver",
  isAnnuityProduct: "isAnnuityProduct",
  isPackageProduct: "isPackageProduct",
  saEqual: "saEqual",
  attachCompulsory: "attachCompulsory",
  displayPremiumIndi: "displayPremiumIndi",
  displayMonthlyCoiIndi: "displayMonthlyCoiIndi",
  pointToSpouse: "pointToSpouse",
  inputFields: "inputFields"

}
exp.saLimitMapper = {
  moneyId : "currencyId",
  minAge : "minAge",
  maxAge : "maxAge",
  insdMinAmount : "minAmount",
  insdMaxAmount : "maxAmount",
}
exp.premiumLimitMapper = {
  minAge: "minAge",
  maxAge: "maxAge",
  chargePeriod: "premiumTermType",
  chargeYear: "premiumTermValue",
  minInitialPrem: "minInitialPremium",
  maxInitialPrem: "maxInitialPremium",
}
exp.ageLimitMapper = {
  premiumTermType: "premiumTermType",
  premiumTermValue: "premiumTermValue",
  coverageTermType: "coverageTermType",
  coverageTermValue: "coverageTermValue",
  paymentTermType: "coverageTermValue",
  paymentTermValue: "paymentTermValue",
  gender: "gender",
  benefitLevel: "benefitLevel",
  minInsdNbAgeUnit: "minInsuredAgeUnit",
  minInsdNbAge: "minInsuredAge",
  maxInsdNbAge: "maxInsuredAge",
  minPhNbAge : "minPolicyholderAge",
  maxPhNbAge: "maxPolicyholderAge"
}
exp.benefitLevelMapper = {
  level : "benefitLevel",
  levelDesc : "levelDesc",
  levelAmount: "levelAmount"
}


module.exports = exp;
