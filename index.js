const fs = require('fs');
const lex = require('./interpreter/lexer');
const parse = require('./interpreter/parser');
const exe = require('./interpreter/execute');

fs.readFile('./input.tlisp', (err, data) => {
    if (err) throw err;
    //console.log(data.toString())
    exe(parse(lex(data.toString())))
});




