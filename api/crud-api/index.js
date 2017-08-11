var sqlite3 = require('sqlite3').verbose();
var dbStatus = 'CLOSED'
var _db;
let moment = require('moment');
let _ = require('lodash');
var __ = (x) => x

function openDB() {
  return new Promise((resolve,reject) => {
    if (dbStatus === 'CLOSED') {
      _db = new sqlite3.Database('api.db',sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, () => {
        dbStatus = 'OPEN'
        resolve(_db)
      })
    } else {
      resolve(_db)
    }

  })
}

function closeDB() {
  return new Promise( (resolve, reject) => {
    if (dbStatus !== 'CLOSED') {
      _db.close(() => {
          dbStatus = 'CLOSED'
          resolve('CLOSED')
      })
    }
  })
}

function getDB() {
  return openDB()
}
function getDBStatus() { return dbStatus }

function init() {
  var prom = new Promise((resolve,reject) => {
    getDB()
    .then(database => {
//        database.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users';", [], (err, row) => {
        database.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
//            const tablesToCheck = ["users","submissions","proposals","tenants"];
//            console.log("*** table names ", rows);
            const wantedTables = ["users", "submissions","proposals", "tenants"]
            let newTables = [];
            wantedTables.forEach(function(table) {
                let doc = rows.find((row => row.name === table))
                if (!doc) newTables.push(table)
            })
//            console.log("New tables to create -->", newTables)

//            let exists = rows.find(function(row,index) {return row.name === 'users'})
//
//            console.log("Database exists ?", exists)
//
            var stmt, useStmt = false;
            if (newTables.length > 0 ) {
                database.serialize(function() {

                  if (newTables.indexOf("users") >= 0 ) {
                    database.run("CREATE TABLE if not exists users (userId TEXT, favouritePackages TEXT)");
                    var stmt = database.prepare("INSERT INTO users VALUES (?, ?)");
                    ["ycloh","default"].forEach( userName => {
                    stmt.run(userName, JSON.stringify([]) )
                    useStmt = true;
                  })

                  }
                  if (newTables.indexOf("tenants") >= 0 ) {
                    database.run("CREATE TABLE if not exists tenants (tenantCode TEXT, tenantName TEXT)");
                  stmt = database.prepare("INSERT INTO tenants VALUES (?, ?)");
                  [['ebao','eBaoTech'],['acme','Acme Insurance']].forEach( tenant => {
                    stmt.run(tenant, JSON.stringify([]) )
                  })
                  useStmt = true;
                  }
                  if (newTables.indexOf("submissions") >= 0) {
                    //   console.log("running create table for submissions")
                      let sql = `create table if not exists submissions (
                                    pk integer primary key, doctype varchar, submissionDate date, submissionType varchar,
                                    submissionChannel varchar, tenantCode varchar, submissionRefNo varchar,
                                    status varchar, decision varchar, userId varchar, lastModified date,
                                    extensionFields text, submissionData text, messages text
                                )`
                        database.run(sql);
                  }
                  if (newTables.indexOf("proposals") >= 0) {
                    //   console.log("running create table for submissions")
                      let sql = `create table if not exists proposals (
                                    pk integer primary key, doctype varchar, creationDate date, proposalType varchar,
                                    submissionChannel varchar, tenantCode varchar, proposalReferenceNo varchar,
                                    status varchar, userId varchar, lastModified date, proposerName varchar,
                                    policyholderSection text, policyholderDisclosureSection text,
                                    lifeAssuredSection text, lifeAssuredDisclosureSection text,
                                    paymentSection text, proposedInsuranceSection text,
                                    extensionFields text, messages text, lifeAssuredName varchar,
                                    mainProductCode varchar, mainProductName varchar, version bigint
                                )`
                        database.run(sql);
                  }



//
//
                if (useStmt) {
                    stmt.finalize(() => resolve('OK'))
                }  else {
                    resolve('OK')
                }
//                  database.each("SELECT userId, favouritePackages FROM users", function(err, row) {
//                      console.log(row.userId + ": " + row.favouritePackages);
//                  });
                });
            } else {
                resolve('OK')
            }
        })
    })
})
  return prom
}

function getUserDoc( userId ) {
  let prom = new Promise((resolve,reject) => {

      getDB()
      .then(database => {
          database.all("select userId, favouritePackages from users where userId = ?", [userId], (err,rows) => {
              if (err) {
                reject(err)
                return
              }
              let row = rows.length <= 0 ?  {} : {userId: rows[0].userId, favouritePackages: JSON.parse( rows[0].favouritePackages) }
              resolve(row)
          })
      })
  })
  .catch( (reason) => {
    console.log("****Error in getUserDoc", reason)
  })
  return prom;
}
function addFavouritePackage(userId, packageCode) {
  return new Promise((resolve,reject) => {
      getUserDoc(userId)
        .then(doc => {
          if (Object.keys(doc).length > 0 ) {
              if (doc.favouritePackages.indexOf(packageCode) < 0 ) {
                doc.favouritePackages.push(packageCode)
                return saveUserDoc(doc)
              }
              return new Promise(resolve => resolve(doc)) // no need to save as nothing will be changed
          } else {
            doc = {userId: userId, favouritePackages: [packageCode]}
            return createUserDoc(doc)
          }
        })
        .then(doc => {
            // console.log("**resolving addFavouritePackage", doc)
            resolve(doc)
        })
  })
}
function removeFavouritePackage(userId, packageCode) {
  return new Promise((resolve,reject) => {
      getUserDoc(userId)
        .then(doc => {
          if (Object.keys(doc).length > 0 ) {
              let indx = doc.favouritePackages.indexOf(packageCode)
              if ( indx >= 0 ) {
                doc.favouritePackages.splice(indx, 1);
                return saveUserDoc(doc)
              }
              return new Promise(resolve => resolve(doc)) // no need to save as nothing will be changed
          } else {
            reject("User does not exists")
          }
        })
        .then(doc => {
            // console.log("**resolving addFavouritePackage", doc)
            resolve(doc)
        })
  })
}

function saveUserDoc(doc) {
  return new Promise((resolve,reject) => {
      let userId = doc.userId
      getDB()
      .then(database => {
          database.run("update users set favouritePackages = ? where userId = ? ", [JSON.stringify(doc.favouritePackages), userId ], err => {
            if (err) reject(err)
            resolve(doc)
          })
      })
  })
}
function createUserDoc(doc) {
  // console.log("Creating new user doc", doc)
  return new Promise((resolve,reject) => {
      let userId = doc.userId
      getDB()
      .then(database => {
        database.run("insert  into users values (?, ?) ", [ doc.userId, JSON.stringify(doc.favouritePackages) ], err => {
          if (err) reject(err)
          resolve(doc)
        })
      })
  })
}

function getTenantList(){
    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            database.all(`select tenantCode, tenantName from tenants`,[], (err, rows) => {
                if (err) reject(err)
                resolve(rows)
            })
        })
    })
}




function createProposalSubmission(submission) {
    // augment the submission doc with additional fields
    submission.doctype = "Submission"
    submission.status = "SUBMITTED"
    submission.lastModified = moment().format("YYYY-MM-DD HH24:mm:ss")
    if (!submission.userId) submission.userId = 'default'

    const jsonFields = ["submissionData", "extensionFields", "messages"]
    jsonFields.forEach(fname => submission[fname] ? submission[fname] = JSON.stringify(submission[fname]) : "")

    const docFields = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]
    let fields = docFields.join(",");
    let values = _.range(docFields.length).map(x => '?').join(",")
    let sql = `insert into submissions (${fields} ) values (${values} )`
    let data = docFields.map(fname => submission[fname] ? submission[fname] : null )
    // some of the fields have to be converted to strings using JSON.stringify

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            database.run( sql, data, function (err)  {
                if (err) {
                    reject({ok: false, errors: err })
                } else {
                    submission.pk = this.lastID
                    jsonFields.forEach(fname => submission[fname] ? submission[fname] = JSON.parse(submission[fname]) : undefined)
                    resolve({ok:true, response: submission})
                }
            })
        })
        .catch((err) => reject(err))
    })
}
function submitProposal(submission) {
    // need to update proposal & submission tables -- use transactions
    submission.doctype = "Submission"
    submission.status = "SUBMITTED"
    submission.lastModified = moment().format("YYYY-MM-DD HH24:mm:ss")
    if (!submission.userId) submission.userId = 'default'
    const proposalId = submission.submissionData.pk
    const version = submission.submissionData.version

    const jsonFields = ["submissionData", "extensionFields", "messages"]
    jsonFields.forEach(fname => submission[fname] ? submission[fname] = JSON.stringify(submission[fname]) : "")

    const docFields = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]
    let fields = docFields.join(",");
    let values = _.range(docFields.length).map(x => '?').join(",")
    let sql = `insert into submissions (${fields} ) values (${values} )`
    let data = docFields.map(fname => submission[fname] ? submission[fname] : null )
    // some of the fields have to be converted to strings using JSON.stringify
    let dbstatus = {s1:'?', s2:'?'};
    return new Promise((resolve,reject) => {
        getDB()
        .then(db => {
            db.serialize(function() {
                db.run("begin transaction")
                db.run( sql, data, function (err)  {
                    dbstatus['s2'] = !err && this.lastID ? 'ok' : 'ko'
                    submission.pk = this.lastID
                    jsonFields.forEach(fname => submission[fname] ? submission[fname] = JSON.parse(submission[fname]) : undefined)
                    if (dbstatus['s1'] !== '?' && dbstatus['s2'] !== '?') {
                        const okay = dbstatus['s1'] === 'ok' && dbstatus['s2'] === 'ok'
                        if (okay) {
                            db.run("commit")
                            resolve({ok:true, submission: submission})
                        } else {
                            db.run("rollback")
                            resolve({ok:false, errors: err})
                        }
                    }
                })

                db.run(`update proposals set status = 'SUBMITTED' where pk = ? and version = ? `, [proposalId, version] , function(err) {
                    dbstatus['s1'] = !err && this.changes === 1 ? 'ok' : 'ko'
                    if (dbstatus['s1'] !== '?' && dbstatus['s2'] !== '?') {
                        const okay = dbstatus['s1'] === 'ok' && dbstatus['s2'] === 'ok'
                        if (okay) {
                            db.run("commit")
                            resolve({ok:true, response: submission})
                        } else {
                            db.run("rollback")
                            resolve({ok:false, errors: err})
                        }
                    }
                })
                
            })
        })
        .catch((err) => {
            db.run("rollback")
            reject({ok:false, errors: err })
        })

    })
}


function fetchProposalSubmissionByRefNo(refNo) {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let sql = `select ${fieldNames} from submissions where submissionRefNo = ? `
            database.get(sql,[refNo], (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    })
}
// fetch a submission by pk
function fetchProposalSubmissionByPk(pk, submissionType='') {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]

    // ["submissionData", "extensionFields", "messages"].forEach(fname => submission[fname] ? submission[fname] = JSON.stringify(submission[fname]) : "")
    const jsonFields = ["submissionData", "extensionFields", "messages"] ;

    let typeClause = ""
    if ( _.isArray(submissionType) && submissionType.length > 0 ) {
        let clause = "AND submissionType in ("
        submissionType.forEach( (t,i) => clause += "'" + t + "'" + (i+1 === submissionType.length ? ")" : ","))
        typeClause = clause
    } else {
        typeClause = submissionType ? `AND submissionType = '${submissionType}'` : '';
    }

    // let typeClause = submissionType ? `AND submissionType = '${submissionType}'` : '';

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let sql = `select ${fieldNames} from submissions where pk = ? ${typeClause}`
            database.get(sql,[pk], (err, row) => {
                console.log("***", row, err)
                if (err) {
                    reject(err)
                } else {
                    if (!row) {
                        resolve(null)
                    } else {
                        jsonFields.forEach(fname => {
                            row[fname] ? row[fname] = JSON.parse(row[fname]) : row[fname] = fname === 'messages' ? [] : {}
                        })
                        resolve(row)
                    }
                }
            })
        })
    })
}

function fetchSubmissionSummaryList(userId, submissionType, filters, limit, offset, orderBy='') {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified", "extensionFields"]
    return _fetchSubmissions(fnames, userId, submissionType, filters, limit, offset, orderBy)
}
function fetchSubmissionList(userId, submissionType, filters, limit, offset, orderBy='') {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]
    return _fetchSubmissions(fnames, userId, filters, limit, offset, orderBy)
}

function _fetchSubmissions(fnames, userId, submissionType, filters, limit, offset, orderBy) {
    const jsonFields = ["submissionData", "extensionFields", "messages"].filter(f => fnames.indexOf(f) >= 0)

    let sortOrder = orderBy.startsWith('-') ? 'desc' : 'asc';
    let sort = orderBy.startsWith('-') ? orderBy.substring(1) : orderBy;
    let sorting = orderBy ? `ORDER BY ${sort} ${sortOrder}` : ''
    let typeClause = ""
    if ( _.isArray(submissionType) && submissionType.length > 0 ) {
        let clause = "AND submissionType in ("
        submissionType.forEach( (t,i) => clause += "'" + t + "'" + (i+1 === submissionType.length ? ")" : ","))
        typeClause = clause
    } else {
        typeClause = submissionType ? `AND submissionType = '${submissionType}'` : '';
    }

    // the filters need to be translated to where conditions , err....not so simple
    // not production ready --- need to use prepare statement instead
    const validKeys = ["pk", "submissionType", "submissionDate", "submissionChannel", "tenantCode", "status", "lastModified"]
    let whereClause = ''
    if (filters) {
        let wlist=[]
        wlist = filters.map( ands => {
            let andlist = ands.map( and => {
                let where;
                if (validKeys.indexOf(and.key) >= 0 ) {
                    if (and.oper === 'eq') {
                        where = typeof and.value === 'string'  ? `${and.key} = '${and.value}'`
                                                                   : _.isDate(and.value) ? `${and.key} = '${moment(and.value).format('YYYY-MM-DD')}'`
                                                                   : `${and.key} = ${parseInt(and.value)}`
                   } else if (and.oper === 'startsWith') {
                       where = `${field} like '${and.value}%'`
                   } else if (and.oper === 'contains') {
                       where = `${field} like '%${and.value}%'`
                   } else if (and.oper === 'gt') {
                       where = typeof and.value === 'string'  ? `${and.key} > '${and.value}'`
                                                                  : _.isDate(and.value) ? `${and.key} > '${moment(and.value).format('YYYY-MM-DD')}'`
                                                                  : `${and.key} > ${parseInt(and.value)}`
                   } else if  (and.oper === 'gte') {
                       where = typeof and.value === 'string'  ? `${and.key} >= '${and.value}'`
                                                                  : _.isDate(and.value) ? `${and.key} >= '${moment(and.value).format('YYYY-MM-DD')}'`
                                                                  : `${and.key} >= ${parseInt(and.value)}`
                   }
               } else {
                   where = "1=0" // since it is not a valid key , make the where condition fail
               }
               return where
            })
            return "(" + andlist.join(' and ') + ")"; // (pk = 1 and channel = 'direct')
        })
        whereClause = `where (userId = '${userId}' ${typeClause} ) AND ` + wlist.join (' OR ')
        // console.log("whereClause = ", limit , offset, whereClause)
    } else {
        whereClause = `where userId = '${userId}' ${typeClause}`
    }
    let limitClause = limit ? 'LIMIT ' + limit : ''
    let offsetClause = offset ? 'OFFSET ' + offset : ''

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let sql = `select ${fieldNames} from submissions ${whereClause} ${sorting} ${limitClause}  ${offsetClause}`
            console.log("sql--->", sql)
            database.all(sql,[], (err, rows) => {
                if (err) reject(err)
                rows = rows.map(submission => {
                    jsonFields.forEach(fname => submission[fname] ? submission[fname] = JSON.parse(submission[fname]) : submission[fname] = fname === 'messages' ? [] : {})
                    return submission
                })
                resolve(rows)
            })
        })
    })
}
// <<<<<<<<<<<<<<

function createProposal(proposal) {
    proposal.doctype = "Proposal"
    proposal.status = "PENDING"
    proposal.lastModified = moment().format("YYYY-MM-DD HH24:mm:ss")
    if (!proposal.creationDate) proposal.creationDate = moment().format("YYYY-MM-DD HH24:mm:ss")
    if (!proposal.userId) proposal.userId = 'default'

    // for lifeAssuredName, mainProductCode, & mainProductName, need to get data from elsewhere
    let products = proposal.proposedInsuranceSection.coverageList || proposal.proposedInsuranceSection.productList
    if (!proposal.mainProductCode) proposal.mainProductCode = products[0].productCode
    if (!proposal.mainProductName) proposal.mainProductName = products[0].productName
    if (!proposal.lifeAssuredName) {
        let insured = products[0].lifeAssuredNumber
        proposal.lifeAssuredName = proposal.proposedInsuranceSection.insuredList[insured].name
    }
    proposal.version = 1 // we are creating, so the version must be 1

    const jsonFields = ["policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection", "paymentSection", "proposedInsuranceSection" , "extensionFields", "messages"]
    jsonFields.forEach(fname => proposal[fname] ? proposal[fname] = JSON.stringify(proposal[fname]) : "")

    const docFields = ["pk", "doctype","creationDate", "proposalType", "submissionChannel", "tenantCode", "proposalReferenceNo", "status", "userId", "lastModified",
    "proposerName", "policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection",
    "lifeAssuredName", "mainProductCode", "mainProductName",
    "paymentSection", "proposedInsuranceSection", "extensionFields", "messages", "version"]

    let fields = docFields.join(",");
    let values = _.range(docFields.length).map(x => '?').join(",")
    let sql = `insert into proposals (${fields} ) values (${values} )`
    let data = docFields.map(fname => proposal[fname] ? proposal[fname] : null )

    // some of the fields have to be converted to strings using JSON.stringify

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            database.run( sql, data, function (err)  {
                if (err) {
                    reject({ok: false, errors: err })
                } else {
                    proposal.pk = this.lastID
                    jsonFields.forEach(fname => proposal[fname] ? proposal[fname] = JSON.parse(proposal[fname]) : undefined)
                    resolve({ok:true, response: proposal})
                }
            })
        })
        .catch((err) => reject(err))
    })
}
function updateProposal(proposal) {
    if (!proposal.pk || !proposal.version) {
        return new Promise((resolve,reject) => { reject(__(`The pk and version is required when updating the proposal `))})
    }
    proposal.lastModified = moment().format("YYYY-MM-DD HH24:mm:ss")
    proposal.userId = proposal.userId || 'default'

    const jsonFields = ["policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection", "paymentSection", "proposedInsuranceSection" , "extensionFields", "messages"]
    jsonFields.forEach(fname => proposal[fname] ? proposal[fname] = JSON.stringify(proposal[fname]) : "")

    const updateFields = ["proposalType", "submissionChannel", "tenantCode", "proposalReferenceNo", "status", "lastModified","userId",
    "proposerName", "policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection",
    "lifeAssuredName", "mainProductCode", "mainProductName",
    "paymentSection", "proposedInsuranceSection", "extensionFields", "messages", "version"]

    let kv = []
    updateFields.forEach(f => kv.push( f + ' = ?' ))
    let fields = kv.join(",");
    // let values = _.range(updateFields.length).map(x => '?').join(",")

    let pk = proposal.pk,
    version = proposal.version
    proposal.version = version + 1
    let sql = `update proposals set ${fields} where pk = ${pk} and version = ${version}`
    let data = updateFields.map(fname => proposal[fname] ? proposal[fname] : null )

    // some of the fields have to be converted to strings using JSON.stringify

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            database.run( sql, data, function (err)  {
                if (err) {
                    reject({ok: false, errors: err })
                } else {
                    let numrows = this.changes
                    if (numrows !== 1) {
                        reject({ok: false, errors: __(`Number of rows updated is incorrect : ${this.changes}. Record updated by someone else. Please reload proposal and re-submit`) })
                    } else {
                        jsonFields.forEach(fname => proposal[fname] ? proposal[fname] = JSON.parse(proposal[fname]) : undefined)
                        resolve({ok:true, response: proposal})
                    }
                }
            })
        })
        .catch((err) => reject(err))
    })
}

function deleteProposal(pk, version, proposal, proposalType) {
    if (!pk || !version) {
        return new Promise((resolve,reject) => { reject(__(`The pk and version is required when deleting the proposal `))})
    }
    let typeClause = ''
    if (proposalType && proposalType.length > 0 ) {
        let clause = "AND proposalType in ("
        proposalType.forEach( (t,i) => clause += "'" + t + "'" + (i+1 === proposalType.length ? ")" : ","))
        typeClause = clause
    }
    let sql = `delete from proposals where pk = ${pk} and version = ${version} ${typeClause}`
    console.log("Delete SQL = ", sql)
    // some of the fields have to be converted to strings using JSON.stringify
    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            database.run( sql, [], function (err)  {
                if (err) {
                    reject({ok: false, errors: err })
                } else {
                    let numrows = this.changes
                    if (numrows !== 1) {
                        reject({ok: false, errors: __(`Error in deleting proposal. Number of rows affected was : ${this.changes}. Record may have been updated by someone else. Please reload proposal and re-submit the request`) })
                    } else {
                        resolve({ok:true, response: proposal})
                    }
                }
            })
        })
        .catch((err) => reject(err))
    })
}

function fetchProposalByRefNo(refNo) {

    const fnames = ["pk", "doctype","creationDate", "proposalType", "submissionChannel", "tenantCode", "proposalReferenceNo", "status", "userId", "lastModified",
    "proposerName", "policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection",
    "lifeAssuredName", "mainProductCode", "mainProductName",
    "paymentSection", "proposedInsuranceSection", "extensionFields", "messages","version"]

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let sql = `select ${fieldNames} from proposals where proposalReferenceNo = ? `
            database.get(sql,[refNo], (err, row) => {
                if (err) reject(err)
                resolve(row)
            })
        })
    })
}
// fetch a proposal by pk
function fetchProposalByPk(pk, proposalType='') {
    const fnames = ["pk", "doctype","userId","creationDate", "proposalType", "submissionChannel", "tenantCode", "proposalReferenceNo", "status", "lastModified",
    "proposerName", "policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection",
    "lifeAssuredName", "mainProductCode", "mainProductName",
    "paymentSection", "proposedInsuranceSection", "extensionFields", "messages","version"]

    // ["submissionData", "extensionFields", "messages"].forEach(fname => submission[fname] ? submission[fname] = JSON.stringify(submission[fname]) : "")
    const jsonFields = ["policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection", "paymentSection", "proposedInsuranceSection","extensionFields", "messages"]

    let typeClause = ""
    if ( _.isArray(proposalType) && proposalType.length > 0 ) {
        let clause = "AND proposalType in ("
        proposalType.forEach( (t,i) => clause += "'" + t + "'" + (i+1 === proposalType.length ? ")" : ","))
        typeClause = clause
    } else {
        typeClause = proposalType ? `AND proposalType = '${proposalType}'` : '';
    }

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let pkInt = _.isString(pk) ? parseInt(pk) : pk
            let sql = `select ${fieldNames} from proposals where pk = ? ${typeClause}`
            database.get(sql,[pkInt], (err, row) => {
                if (err) {
                    reject(err)
                } else {
                    if (!row) {
                        resolve(null)
                    } else {
                        jsonFields.forEach(fname => {
                            row[fname] ? row[fname] = JSON.parse(row[fname]) : row[fname] = fname === 'messages' ? [] : {}
                        })
                        resolve(row)
                    }
                }
            })
        })
    })
}

function fetchProposalSummaryList(userId, proposalType, filters, limit, offset, orderBy='') {
    const fnames = ["pk", "doctype","version","creationDate", "proposalType", "submissionChannel", "tenantCode", "proposalReferenceNo", "status", "userId", "lastModified",
    "proposerName", "policyholderSection", "lifeAssuredName", "mainProductCode", "mainProductName"
    ]

    return _fetchProposals(fnames, userId, proposalType, filters, limit, offset, orderBy)
}
function fetchProposalList(userId, proposalType, filters, limit, offset, orderBy='') {
    const fnames = ["pk", "doctype","version","creationDate", "proposalType", "submissionChannel", "tenantCode", "proposalReferenceNo", "status", "userId", "lastModified",
    "proposerName", "policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection",
    "lifeAssuredName", "mainProductCode", "mainProductName",
    "paymentSection", "proposedInsuranceSection", "extensionFields", "messages"]
    return _fetchProposals(fnames, userId, filters, limit, offset, orderBy)
}

function _fetchProposals(fnames, userId, proposalType, filters, limit, offset, orderBy) {

    const jsonFields = ["policyholderSection", "policyholderDisclosureSection", "lifeAssuredSection", "lifeAssuredDisclosureSection", "paymentSection", "proposedInsuranceSection","extensionFields", "messages"].filter(f => fnames.indexOf(f) >= 0)

    let sortOrder = orderBy.startsWith('-') ? 'desc' : 'asc';
    let sort = orderBy.startsWith('-') ? orderBy.substring(1) : orderBy;
    let sorting = orderBy ? `ORDER BY ${sort} ${sortOrder}` : ''
    let typeClause = ""
    if ( _.isArray(proposalType) && proposalType.length > 0 ) {
        let clause = "AND proposalType in ("
        proposalType.forEach( (t,i) => clause += "'" + t + "'" + (i+1 === proposalType.length ? ")" : ","))
        typeClause = clause
    } else {
        typeClause = proposalType ? `AND proposalType = '${proposalType}'` : '';
    }

    // the filters need to be translated to where conditions , err....not so simple submission
    // not production ready --- need to use prepare statement instead
    const validKeys = ["pk", "proposalType", "creationDate", "submissionChannel", "tenantCode", "status", "lastModified","proposalReferenceNo"]
    let whereClause = ''
    if (filters) {
        let wlist=[]
        wlist = filters.map( ands => {
            let andlist = ands.map( and => {
                let where;
                if (validKeys.indexOf(and.key) >= 0 ) {
                    if (and.oper === 'eq') {
                        where = typeof and.value === 'string'  ? `${and.key} = '${and.value}'`
                                                                   : _.isDate(and.value) ? `${and.key} = '${moment(and.value).format('YYYY-MM-DD')}'`
                                                                   : `${and.key} = ${parseInt(and.value)}`
                   } else if (and.oper === 'startsWith') {
                       where = `${field} like '${and.value}%'`
                   } else if (and.oper === 'contains') {
                       where = `${field} like '%${and.value}%'`
                   } else if (and.oper === 'gt') {
                       where = typeof and.value === 'string'  ? `${and.key} > '${and.value}'`
                                                                  : _.isDate(and.value) ? `${and.key} > '${moment(and.value).format('YYYY-MM-DD')}'`
                                                                  : `${and.key} > ${parseInt(and.value)}`
                   } else if  (and.oper === 'gte') {
                       where = typeof and.value === 'string'  ? `${and.key} >= '${and.value}'`
                                                                  : _.isDate(and.value) ? `${and.key} >= '${moment(and.value).format('YYYY-MM-DD')}'`
                                                                  : `${and.key} >= ${parseInt(and.value)}`
                   }
               } else {
                   where = "1=0" // since it is not a valid key , make the where condition fail
               }
               return where
            })
            return "(" + andlist.join(' and ') + ")"; // (pk = 1 and channel = 'direct')
        })
        whereClause = `where (userId = '${userId}' ${typeClause} ) AND ` + wlist.join (' OR ')
        // console.log("whereClause = ", limit , offset, whereClause)
    } else {
        whereClause = `where userId = '${userId}' ${typeClause}`
    }
    let limitClause = limit ? 'LIMIT ' + limit : ''
    let offsetClause = offset ? 'OFFSET ' + offset : ''

    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let sql = `select ${fieldNames} from proposals ${whereClause} ${sorting} ${limitClause}  ${offsetClause}`
            console.log("proposal fetch sql--->", sql)
            database.all(sql,[], (err, rows) => {
                if (err) reject(err)
                let datarows = rows || []
                let results = datarows.map(proposal => {
                    jsonFields.forEach(fname => proposal[fname] ? proposal[fname] = JSON.parse(proposal[fname]) : proposal[fname] = fname === 'messages' ? [] : {})
                    return proposal
                })
                resolve(results)
            })
        })
    })
}
//>>>>>>>>>>>>>


module.exports = { getDB, closeDB, getDBStatus, getUserDoc, init, addFavouritePackage, removeFavouritePackage,
                   getTenantList, createProposalSubmission, fetchProposalSubmissionByRefNo, fetchSubmissionList, fetchSubmissionSummaryList,
                   fetchProposalSubmissionByPk, createProposal, fetchProposalByPk, fetchProposalByRefNo, fetchProposalList, fetchProposalSummaryList,
                   updateProposal, deleteProposal, submitProposal
                 }
