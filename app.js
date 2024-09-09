const e = require("express");

const arr = [1, 3, 8, 6, 4   ]
console.log( Math.min( ...arr))



const mifuncion = (...arg)=> {
    arg.forEach(element => {
        console.log(element)
    });

}


console.log( mifuncion( ...arr ))

