const mod = require("./module");

const aFunc = function() {
    console.log(arguments);
};

aFunc(1,"2",3,{4:"hello"});

mod.a();