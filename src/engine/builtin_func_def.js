"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id_to_builtin_func = void 0;
var datatype_def_1 = require("./datatype_def");
var error_def_1 = require("./error_def");
var id_to_builtin_func = {
    //addition for scalars
    '101': {
        param_count: 2,
        func_name: 'scalar_addition',
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
                throw new Error("scalar_addition: unknown input types");
            }
        }
    },
    //subtraction
    '102': {
        param_count: 2,
        func_name: 'scalar_subtraction',
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number]],
        param_names: ['minuend', 'subtrahend'],
        output_types: [[datatype_def_1.data_types.dt_number]],
        output_names: ['difference'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_number)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Built in function 1: scalar_substrating receives two scalars as parameters');
            return [Number(args[0]) - Number(args[1])];
        }
    },
    //multiplication
    '103': {
        param_count: 2,
        func_name: 'scalar_multiplication',
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number]],
        param_names: ['multiplicand', 'multiplier'],
        output_types: [[datatype_def_1.data_types.dt_number]],
        output_names: ['product'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_number)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Built in function 2: scalar_multiplication receives two scalars as parameters');
            return [Number(args[0]) * Number(args[1])];
        }
    },
    //division
    '104': {
        param_count: 2,
        func_name: 'scalar_division',
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number]],
        param_names: ['dividend', 'divisor'],
        output_types: [[datatype_def_1.data_types.dt_number]],
        output_names: ['quotient'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_number)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Built in function 3: scalar_division receives two scalars as parameters');
            return [Number(args[0]) / Number(args[1])];
        }
    },
    //number to function points
    '105': {
        param_count: 2,
        func_name: 'scalar_to_function_points',
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number]],
        param_names: ['value', 'length'],
        output_types: [[datatype_def_1.data_types.dt_func_pt_series]],
        output_names: ['func pts'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_integer)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Built in function 5: number_to_function_points receives one scalar and one integer as parameters');
            var val = Number(args[0]);
            var length = Number(args[1]);
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
        func_name: 'apply_interest_rate',
        param_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_func_pt_series]],
        param_names: ['interest rate', 'func pts'],
        output_types: [[datatype_def_1.data_types.dt_func_pt_series]],
        output_names: ['func pts'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!datatype_def_1.declared_type_verifier[0](args[0]) || !datatype_def_1.declared_type_verifier[1](args[1]))
                throw new error_def_1.FuncArgError('Built in function 6: apply_interest_rate receives one scalar and one function points series as parameters');
            var rate = args[0];
            var ser = args[1];
            for (var i = 1; i < ser.length; i++) {
                ser[i][1] = (1 + rate) * ser[i - 1][1];
            }
            return [ser];
        }
    },
    '107': {
        param_count: 1,
        func_name: 'test_func',
        param_types: [[datatype_def_1.data_types.dt_number]],
        param_names: ['param 1'],
        output_types: [[datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_series]],
        output_names: ['output 1', 'output 2', 'output 3'],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return [1];
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
