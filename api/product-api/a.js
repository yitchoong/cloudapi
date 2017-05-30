var async = require('asyncawait/async');
var await = require('asyncawait/await');

function getCoffee() {
  return new Promise(resolve => {
    setTimeout(() => resolve('☕'), 2000); // it takes 2 seconds to make coffee
  });
}

var go = async( function() {
  try {
    // but first, coffee
    const coffee = await (getCoffee());
    console.log(coffee); // ☕
  } catch (e) {
    console.error(e); // 💩
  }
})

go();
