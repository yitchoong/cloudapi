var sqlite3 = require('sqlite3').verbose();
var dbStatus = 'CLOSED'
var _db;
let moment = require('moment');
let _ = require('lodash');

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
            const wantedTables = ["users", "submissions","proposal", "tenants"]
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
function fetchProposalSubmissionByPk(pk) {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]

    // ["submissionData", "extensionFields", "messages"].forEach(fname => submission[fname] ? submission[fname] = JSON.stringify(submission[fname]) : "")
    const jsonFields = ["submissionData", "extensionFields", "messages"] ;
    return new Promise((resolve,reject) => {
        getDB()
        .then(database => {
            let fieldNames = fnames.join(',')
            let sql = `select ${fieldNames} from submissions where pk = ? `
            database.get(sql,[pk], (err, row) => {
                if (err) reject(err)
                jsonFields.forEach(fname => {
                    row[fname] ? row[fname] = JSON.parse(row[fname]) : row[fname] = fname === 'messages' ? [] : {}
                })
                resolve(row)
            })
        })
    })
}

function fetchSubmissionSummaryList(userId, submissionType, filters, limit, offset, orderBy='') {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified", "extensionFields"]
    return _fetchSubmissions(fnames, userId, submissionType, filters, limit, offset, orderBy='')
}
function fetchSubmissionList(userId, submissionType, filters, limit, offset, orderBy='') {
    const fnames = ["pk", "doctype","submissionDate", "submissionType", "submissionChannel", "tenantCode", "submissionRefNo", "status", "decision", "userId", "lastModified","submissionData", "extensionFields", "messages"]
    return _fetchSubmissions(fnames, userId, filters, limit, offset, orderBy='')
}

function _fetchSubmissions(fnames, userId, submissionType, filters, limit, offset, orderBy) {

    const jsonFields = ["submissionData", "extensionFields", "messages"].filter(f => fnames.indexOf(f) >= 0)

    let sortOrder = orderBy.startsWith('-') ? 'desc' : 'asc';
    let sort = orderBy.startsWith('-') ? orderBy.substring(1) : orderBy;
    let sorting = orderBy ? `ORDER BY ${sort} ${sortOrder}` : ''
    let typeClause = submissionType ? `AND submissionType = '${submissionType}'` : '';

    // the filters need to be translated to where conditions , err....not so simple
    let whereClause = ''
    if (filters) {
        let wlist=[]
        wlist = filters.map( ands => {

            let andlist = ands.map( and => {
                let where;
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



module.exports = { getDB, closeDB, getDBStatus, getUserDoc, init, addFavouritePackage, removeFavouritePackage,
                   getTenantList, createProposalSubmission, fetchProposalSubmissionByRefNo, fetchSubmissionList, fetchSubmissionSummaryList,
                   fetchProposalSubmissionByPk
                 }
