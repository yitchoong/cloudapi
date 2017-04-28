'use strict'

let strings = require('./en');

var gettext = function (key, ...variables) {
    let translated = strings[key];
    let message = !translated || translated.trim().length === 0 ? key : translated;
    return trans(message,...variables)
}

function trans(string, ...context) {
    var pattern = /{{.*?}}/g;
    return string.replace(pattern, function(match){
        return context[ match.replace('{{','').replace('}}','').trim()];
    });
}

module.exports = gettext;
