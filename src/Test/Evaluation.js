"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var engine_1 = require("../engine/engine");
var add = require("./json/hello world (20).json");
var sub = require("./json/hello world (21).json");
var mul = require("./json/hello world (22).json");
var div = require("./json/hello world (23).json");
var intst = require("./json/hello world (24).json");
var addSub = require("./json/hello world (25).json");
var subMul = require("./json/hello world (26).json");
var subMulDiv = require("./json/hello world (27).json");
var subMulDivTwoOut = require("./json/hello world (28).json");
var console_1 = require("console");
/**
 * JSON representations are generated using function builder
 */
function testAdd() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(add), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == p1 + p2);
        run += 1;
    }
}
function testSub() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(sub), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == p1 - p2);
        run += 1;
    }
}
function testMul() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(mul), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == p1 * p2);
        run += 1;
    }
}
function testDiv() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(div), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == p1 / p2);
        run += 1;
    }
}
/**
 * Test interest rate calculation
 */
function testIntst() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 10;
        var p2 = Math.round(Math.random() * 10);
        var p3 = Math.random();
        var params = new Map();
        params.set(1, {
            name: "initial",
            value: p1
        });
        params.set(2, {
            name: "len",
            value: p2
        });
        params.set(3, {
            name: "rate",
            value: p3
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(intst), params);
        var arr = res.get(1).value;
        //console.log(res.get(1).value, p1 + p2)
        //assert(res.get(1).value == p1 / p2)
        for (var i = 0; i < p2; i++) {
            if (i == 0) {
                (0, console_1.assert)(p1 == arr[i][1]);
            }
            else {
                //console.log(arr[1][1], (1 + p3), arr[i - 1])
                (0, console_1.assert)(arr[i][1] == (1 + p3) * arr[i - 1][1]);
            }
        }
        run += 1;
    }
}
function testAddSub() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var p3 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        params.set(3, {
            name: "param3",
            value: p3
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(addSub), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == p1 + p2 - p3);
        run += 1;
    }
}
function testSubMul() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var p3 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        params.set(3, {
            name: "param3",
            value: p3
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(subMul), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == (p1 - p2) * p3);
        run += 1;
    }
}
function testSubMulDiv() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var p3 = Math.random() * 100;
        var p4 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        params.set(3, {
            name: "param3",
            value: p3
        });
        params.set(4, {
            name: "param4",
            value: p4
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(subMulDiv), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == (p1 - p2) * p3 / p4);
        run += 1;
    }
}
function testSubMulDivTwoOutputs() {
    var runs = 10;
    var run = 0;
    while (run < runs) {
        var p1 = Math.random() * 100;
        var p2 = Math.random() * 100;
        var p3 = Math.random() * 100;
        var p4 = Math.random() * 100;
        var params = new Map();
        params.set(1, {
            name: "param1",
            value: p1
        });
        params.set(2, {
            name: "param2",
            value: p2
        });
        params.set(3, {
            name: "param3",
            value: p3
        });
        params.set(4, {
            name: "param4",
            value: p4
        });
        var res = (0, engine_1.func_interpreter_new)(JSON.stringify(subMulDivTwoOut), params);
        //console.log(res.get(1).value, p1 + p2)
        (0, console_1.assert)(res.get(1).value == (p1 - p2) * p3 / p4);
        (0, console_1.assert)(res.get(2).value == (p1 - p2) * p3);
        run += 1;
    }
}
function runAll() {
    testAdd();
    testSub();
    testMul();
    testDiv();
    testIntst();
    testAddSub();
    testSubMul();
    testSubMulDiv();
    testSubMulDivTwoOutputs();
}
runAll();
