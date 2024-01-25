"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var test = require("./test.json");
var test1 = require("./test1.json");
var test2 = require("./test2.json");
var engine_1 = require("./engine");
var test_func_str = JSON.stringify(test);
var test_func_str1 = JSON.stringify(test1);
var test_func_str2 = JSON.stringify(test2);
//console.log(func_interpreter_new_caller(test_func_str1, 9, 11))
console.log('final return value', (0, engine_1.func_interpreter_new_caller)(test_func_str2, 0.1, 7, 4));
