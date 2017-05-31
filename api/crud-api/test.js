var crud = require('./index')
    
crud.init()
.then( status => {
   return crud.init()
})
.then(status => {    
   return crud.getUserDoc("yc")
})
.then((res) => {
//   return crud.addFavouritePackage('yc','AIPP')
   return crud.removeFavouritePackage('ycxx','AIPP')
})
.then(doc => {
   console.log("**** doc returned from udpate", doc)
})
.catch( (err) => console.log("Error --> ", err))    
