"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var builtin_func_def_1 = require("../engine/builtin_func_def");
var a = [[1, 5, 5], [2, 6, 6], [3, 7, 7]];
var b = [[1, 10], [2, 11], [3, 12]];
var c = [[1, 5, 5, 19], [2, 6, 6, 18], [3, 7, 7, 17], [5, 1, 1, 1]];
console.log(builtin_func_def_1.id_to_builtin_func['109'].func(a, b, c));
