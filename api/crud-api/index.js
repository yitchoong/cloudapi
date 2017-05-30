var sqlite3 = require('sqlite3').verbose();
var dbStatus = 'CLOSED'
var _db;


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
        database.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users';", [], (err, row) => {
          let exists = false;
          if (row && row.name) exists = true;
          console.log("Database exists ?", exists)
          if (!exists) {
            database.serialize(function() {
              database.run("CREATE TABLE if not exists users (userId TEXT, favouritePackages TEXT)");
              var stmt = database.prepare("INSERT INTO users VALUES (?, ?)");
              ["ycloh","default"].forEach( userName => {
                stmt.run(userName, JSON.stringify([]) )
              })
              stmt.finalize(() => {
                resolve('OK')
              });
              database.each("SELECT userId, favouritePackages FROM users", function(err, row) {
                  console.log(row.userId + ": " + row.favouritePackages);
              });
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

module.exports = { getDB, closeDB, getDBStatus, getUserDoc, init, addFavouritePackage, removeFavouritePackage  }
