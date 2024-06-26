"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.id_to_builtin_func = void 0;
var datatype_def_1 = require("./datatype_def");
var error_def_1 = require("./error_def");
var id_to_builtin_func = {
    //addition for scalars
    '101': {
        param_count: 2,
        func_name: 'Add',
        description: "Addition on two numbers or two series. If two series were given, addition will be calculated per entry",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series, datatype_def_1.data_types.dt_series]],
        param_names: ['addend_1', 'addend_2'],
        output_types: [[datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series]],
        output_names: ['sum'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if ((0, datatype_def_1.is_number)(args[0]) && (0, datatype_def_1.is_number)(args[1])) {
                return [args[0] + args[1]];
            }
            else if ((0, datatype_def_1.is_series)(args[0]) && (0, datatype_def_1.is_series)(args[1])) {
                var ser1 = args[0];
                var ser2 = args[1];
                var ser3 = [];
                if (ser1.length != ser2.length) {
                    throw new Error("scalar_addition: input series must be the same length");
                }
                for (var i = 0; i < ser1.length; i++) {
                    ser3[i] = ser1[i] + ser2[i];
                }
                return [ser3];
            }
            else {
                throw new Error("Add: unknown input types");
            }
        }
    },
    //subtraction
    '102': {
        param_count: 2,
        func_name: 'Subtract',
        description: "Subtraction on two numbers or two series. If two series were given, subtraction will be calculated per entry",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series, datatype_def_1.data_types.dt_series]],
        param_names: ['minuend', 'subtrahend'],
        output_types: [[datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series]],
        output_names: ['difference'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if ((0, datatype_def_1.is_number)(args[0]) && (0, datatype_def_1.is_number)(args[1])) {
                return [args[0] - args[1]];
            }
            else if ((0, datatype_def_1.is_series)(args[0]) && (0, datatype_def_1.is_series)(args[1])) {
                var ser1 = args[0];
                var ser2 = args[1];
                var ser3 = [];
                if (ser1.length != ser2.length) {
                    throw new Error("Subtract: input series must be the same length");
                }
                for (var i = 0; i < ser1.length; i++) {
                    ser3[i] = ser1[i] - ser2[i];
                }
                return [ser3];
            }
            else {
                throw new Error("Subtract: unknown input types");
            }
        }
    },
    //multiplication
    '103': {
        param_count: 2,
        func_name: 'Multiply',
        description: "Multiplication on two numbers or two series. If two series were given, multiplication will be calculated per entry",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series, datatype_def_1.data_types.dt_series]],
        param_names: ['multiplicand', 'multiplier'],
        output_types: [[datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series]],
        output_names: ['product'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if ((0, datatype_def_1.is_number)(args[0]) && (0, datatype_def_1.is_number)(args[1])) {
                return [args[0] * args[1]];
            }
            else if ((0, datatype_def_1.is_series)(args[0]) && (0, datatype_def_1.is_series)(args[1])) {
                var ser1 = args[0];
                var ser2 = args[1];
                var ser3 = [];
                if (ser1.length != ser2.length) {
                    throw new Error("Multiply: input series must be the same length");
                }
                for (var i = 0; i < ser1.length; i++) {
                    ser3[i] = ser1[i] * ser2[i];
                    console.log(ser3);
                }
                return [ser3];
            }
            else {
                throw new Error("Multiply: unknown input types");
            }
        }
    },
    //division
    '104': {
        param_count: 2,
        func_name: 'Divide',
        description: "Division on two numbers or two series. If two series were given, division will be calculated per entry",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series, datatype_def_1.data_types.dt_series]],
        param_names: ['dividend', 'divisor'],
        output_types: [[datatype_def_1.data_types.dt_number], [datatype_def_1.data_types.dt_series]],
        output_names: ['quotient'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if ((0, datatype_def_1.is_number)(args[0]) && (0, datatype_def_1.is_number)(args[1])) {
                return [args[0] / args[1]];
            }
            else if ((0, datatype_def_1.is_series)(args[0]) && (0, datatype_def_1.is_series)(args[1])) {
                var ser1 = args[0];
                var ser2 = args[1];
                var ser3 = [];
                if (ser1.length != ser2.length) {
                    throw new Error("Divide: input series must be the same length");
                }
                for (var i = 0; i < ser1.length; i++) {
                    ser3[i] = ser1[i] / ser2[i];
                }
                return [ser3];
            }
            else {
                throw new Error("Divide: unknown input types");
            }
        }
    },
    //number to function points
    '105': {
        param_count: 2,
        func_name: 'Create Double Series',
        description: "Given value and length, returns the double series [[0, val], [1, val], [2, val], ... , [length-1, val]]",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number]],
        param_names: ['value', 'length'],
        output_types: [[datatype_def_1.data_types.dt_multi_series]],
        output_names: ['func pts'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_integer)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Create Double Series receives one scalar and one integer as parameters');
            var val = Number(args[0]);
            var length = Number(args[1]);
            if (length <= 0) {
                throw new error_def_1.FuncArgError("Create Double Series: series length must be > 0");
            }
            /**
             * Converts a number to an array of length 2 tuples
             * outputs: [[0, val], [1, val], [2, val], ... , [length-1, val]]
             */
            // check if length is integer
            var series_out = [];
            for (var i = 0; i < length; i++) {
                series_out[i] = [i, val];
            }
            return [series_out];
        }
    },
    //apply interest rate
    '106': {
        param_count: 2,
        func_name: 'Apply Interest Rate to Number',
        description: "The initial deposit will grow by the interest rate given for k times. K will be rounded up if not an integer",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number]],
        param_names: ['initial deposit', 'interest rate', 'after k cycles'],
        output_types: [[datatype_def_1.data_types.dt_number]],
        output_names: ['ending deposit'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!datatype_def_1.declared_type_verifier[0](args[0]) || !datatype_def_1.declared_type_verifier[0](args[1]) || !datatype_def_1.declared_type_verifier[0](args[2]))
                throw new error_def_1.FuncArgError('Apply Interest Rate to Number receives three numbers as parameters');
            var init = args[0];
            var rate = args[1];
            var k = args[2];
            if (k <= 0) {
                throw new error_def_1.FuncArgError("Apply Interest Rate to Number: k must be > 0");
            }
            for (var i = 0; i < k; i++) {
                init *= (1 + rate);
            }
            return [init];
        }
    },
    '107': {
        param_count: 2,
        func_name: 'Apply Interest Rate to Double Series',
        description: "Given an interest rate and a double series, returns a new double series in which every y value is equal to (1 + rate) multiplied by the previous y value",
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_multi_series]],
        param_names: ['interest rate', 'double series'],
        output_types: [[datatype_def_1.data_types.dt_multi_series]],
        output_names: ['func pts'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!datatype_def_1.declared_type_verifier[0](args[0]) || !datatype_def_1.declared_type_verifier[1](args[1]))
                throw new error_def_1.FuncArgError('Apply Interest Rate to Double Series receives one scalar and one double series as parameters');
            var rate = args[0];
            var ser = args[1];
            for (var i = 1; i < ser.length; i++) {
                ser[i][1] = (1 + rate) * ser[i - 1][1];
            }
            return [ser];
        }
    },
    /**
     * Merge two double series by summing the corresponding y values
     * Example inputs:
     *    [[2000, 10], [2001, 20], [2002, 30]]
     *    [[2002, 40], [2003, 50], [2004, 60]]
     * Example output:
     *    [[2000, 10], [2001, 20], [2002, 70], [2003, 50], [2004, 60]]
     */
    '108': {
        param_count: 2,
        func_name: 'Double Series Entry-wise Add',
        description: "Given two double series, returns a new double series in which y-values with the same x-value will be added",
        param_types: [[datatype_def_1.data_types.dt_multi_series, datatype_def_1.data_types.dt_multi_series]],
        param_names: ['double series 1', 'double series 2'],
        output_types: [[datatype_def_1.data_types.dt_multi_series]],
        output_names: ['merged series'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log(args);
            if (!datatype_def_1.declared_type_verifier[1](args[0]) || !datatype_def_1.declared_type_verifier[1](args[1]))
                throw new error_def_1.FuncArgError('Merge double series receives two double series as parameters');
            var m = new Map();
            var dser1 = args[0];
            var dser2 = args[1];
            for (var _a = 0, dser1_1 = dser1; _a < dser1_1.length; _a++) {
                var pt = dser1_1[_a];
                m.set(pt[0], m.has(pt[0]) ? Number(m.get(pt[0])) + pt[1] : pt[1]);
            }
            for (var _b = 0, dser2_1 = dser2; _b < dser2_1.length; _b++) {
                var pt = dser2_1[_b];
                m.set(pt[0], m.has(pt[0]) ? Number(m.get(pt[0])) + pt[1] : pt[1]);
            }
            var res = Array.from(m);
            res.sort(function (a, b) { return a[0] - b[0]; });
            return [res];
        }
    },
    '109': {
        param_count: -1,
        func_name: 'Merge Double Series',
        description: "Given n double series, merge them into one multi-series with n columns in which each column represents one double series",
        param_types: [[datatype_def_1.data_types.dt_multi_series]],
        param_names: ['double series'],
        output_types: [[datatype_def_1.data_types.dt_multi_series]],
        output_names: ['multi series'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
                var arg = args_1[_a];
                if (!datatype_def_1.declared_type_verifier[3](arg)) {
                    throw new error_def_1.FuncArgError('Build multi-series receives double series as parameters');
                }
            }
            var num_cols = 0;
            for (var _b = 0, args_2 = args; _b < args_2.length; _b++) {
                var arg = args_2[_b];
                arg = arg;
                num_cols += arg[0].length - 1; // we need to remove the first column b/c it's treated as the index column
            }
            var res = new Map();
            var curr_col_acc = 0;
            for (var _c = 0, args_3 = args; _c < args_3.length; _c++) {
                var arg = args_3[_c];
                arg = arg;
                for (var _d = 0, arg_1 = arg; _d < arg_1.length; _d++) {
                    var ser = arg_1[_d];
                    var idx = ser[0];
                    if (!res.has(idx)) { //index not in map
                        res.set(idx, Array(num_cols).fill(0));
                    }
                    for (var j = 1; j < ser.length; j++) {
                        res.get(idx)[curr_col_acc + j - 1] = ser[j];
                    }
                }
                curr_col_acc += arg[0].length - 1;
            }
            var sorted_key = Array.from(res.keys()).sort();
            var ret = [];
            for (var _e = 0, sorted_key_1 = sorted_key; _e < sorted_key_1.length; _e++) {
                var k = sorted_key_1[_e];
                ret.push(__spreadArray([k], res.get(k), true));
            }
            return [ret];
        }
    },
    '110': {
        param_count: 1,
        func_name: 'Sum y-values',
        description: "Given a double series, returns the sum of all y values",
        param_types: [[datatype_def_1.data_types.dt_multi_series]],
        param_names: ['double series'],
        output_types: [[datatype_def_1.data_types.dt_number]],
        output_names: ['y sum'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!datatype_def_1.declared_type_verifier[1](args[0])) {
                throw new error_def_1.FuncArgError('Sum y-values receives a double series as its parameter');
            }
            var s = 0;
            for (var _a = 0, _b = args[0]; _a < _b.length; _a++) {
                var entry = _b[_a];
                s += entry[1];
            }
            return [s];
        }
    }
};
exports.id_to_builtin_func = id_to_builtin_func;
// let name_to_builtin_func : {[name: string] : builtin_function} = {
//     //addition for scalars
//     'scalar_addition' : {
//         param_count: 2, 
//         func_name : 'scalar_addition',
//         param_types : [data_types.dt_number, data_types.dt_number],
//         param_names : ['addend_1', 'addend_2'],
//         output_types : [data_types.dt_number],
//         output_names : ['sum'],
//         func : (...args : allowed_stack_components[]) => {
//             console.log(args[0] + " " + args[1] + " " + args.length);
//             if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
//                 throw new FuncArgError('Built in function 0: scalar_addition receives two scalars as parameters')
//             return [Number(args[0]) + Number(args[1])];
//         }
//     },
//     //subtraction
//     'scalar_subtraction' : {
//         param_count: 2, 
//         func_name : 'scalar_subtraction',
//         param_types : [data_types.dt_number, data_types.dt_number],
//         param_names : ['minuend', 'subtrahend'],
//         output_types : [data_types.dt_number],
//         output_names : ['difference'],
//         func : (...args : allowed_stack_components[]) => {
//             if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
//                 throw new FuncArgError('Built in function 1: scalar_substrating receives two scalars as parameters')
//             return [Number(args[0]) - Number(args[1])];
//         }
//     },
//     //multiplication
//     'scalar_multiplication' : {
//         param_count: 2, 
//         func_name : 'scalar_multiplication',
//         param_types : [data_types.dt_number, data_types.dt_number],
//         param_names : ['multiplicand', 'multiplier'],
//         output_types : [data_types.dt_number],
//         output_names : ['product'],
//         func : (...args : allowed_stack_components[]) => {
//             if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
//                 throw new FuncArgError('Built in function 2: scalar_multiplication receives two scalars as parameters')
//             return [Number(args[0]) * Number(args[1])];
//         }
//     },
//     //division
//     'scalar_division' : {
//         param_count: 2, 
//         func_name : 'scalar_division',
//         param_types : [data_types.dt_number, data_types.dt_number],
//         param_names : ['dividend', 'divisor'],
//         output_types : [data_types.dt_number],
//         output_names : ['quotient'],
//         func : (...args : allowed_stack_components[]) => {
//             if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
//                 throw new FuncArgError('Built in function 3: scalar_division receives two scalars as parameters')
//             return [Number(args[0]) / Number(args[1])];
//         }
//     },
//     'scalar_to_function_points' : {
//         param_count: 2, 
//         func_name : 'number_to_function_points',
//         param_types : [data_types.dt_number, data_types.dt_number],
//         param_names : ['value', 'length'],
//         output_types : [data_types.dt_func_pt_series],
//         output_names : ['func pts'],
//         func : (...args : allowed_stack_components[]) => {
//             console.log('in def, params', args);
//             if (!is_number(args[0]) || !is_integer(args[1]) || args.length !== 2)
//                 throw new FuncArgError('Built in function 5: number_to_function_points receives one scalar and one integer as parameters')
//             const val : number = Number(args[0]);
//             const length : number = Number(args[1]);
//             /**
//              * Converts a number to an array of length 2 tuples
//              * outputs: [[0, val], [1, val], [2, val], ... , [length-1, val]]
//              */
//             // check if length is integer
//             let series_out : any = [];
//             for (let i : number = 1; i <= length; i++) {
//                 //const tmp : any = [i, val]
//                 series_out.push([i, val]);
//             }
//             return [series_out];
//             //return [[[1, 2], [2, 4], [3, 8]]]
//         }
//     },
//     'apply_interest_rate' : {
//         param_count : 2,
//         func_name : 'apply_interest_rate',
//         param_types : [data_types.dt_number, data_types.dt_func_pt_series],
//         param_names : ['interest rate', 'func pts'],
//         output_types : [data_types.dt_func_pt_series],
//         output_names : ['func pts'],
//         func : (...args : allowed_stack_components[]) => {
//             if (!declared_type_verifier[0](args[0]) || !declared_type_verifier[1](args[1]))
//                 throw new FuncArgError('Built in function 6: apply_interest_rate receives one scalar and one function points series as parameters');
//             const rate : any = args[0];
//             // create a copy of it to keep the array passed in unchanged
//             const ser : any = structuredClone(args[1]);
//             for (let i = 1; i < ser.length; i++) {
//                 ser[i][1] = (1 + rate) * ser[i - 1][1];
//             }
//             console.log('ser', ser);
//             return [ser];
//         }
//     },
// }
