"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name_to_builtin_func = exports.id_to_builtin_func = void 0;
var datatype_def_1 = require("./datatype_def");
var error_def_1 = require("./error_def");
var id_to_builtin_func = {
    //addition for scalars
    1: {
        param_count: 2,
        func_name: 'scalar_addition',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_number)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Built in function 0: scalar_addition receives two scalars as parameters');
            return [Number(args[0]) + Number(args[1])];
        }
    },
    //subtraction
    2: {
        param_count: 2,
        func_name: 'scalar_subtraction',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
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
    3: {
        param_count: 2,
        func_name: 'scalar_multiplication',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
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
    4: {
        param_count: 2,
        func_name: 'scalar_division',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
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
    5: {
        param_count: 2,
        func_name: 'number_to_function_points',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_func_pt_series],
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
    6: {
        param_count: 2,
        func_name: 'apply_interest_rate',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_func_pt_series],
        output_types: [datatype_def_1.data_types.dt_func_pt_series],
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
    }
};
exports.id_to_builtin_func = id_to_builtin_func;
var name_to_builtin_func = {
    //addition for scalars
    'scalar_addition': {
        param_count: 2,
        func_name: 'scalar_addition',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!(0, datatype_def_1.is_number)(args[0]) || !(0, datatype_def_1.is_number)(args[1]) || args.length !== 2)
                throw new error_def_1.FuncArgError('Built in function 0: scalar_addition receives two scalars as parameters');
            return [Number(args[0]) + Number(args[1])];
        }
    },
    //subtraction
    'scalar_subtraction': {
        param_count: 2,
        func_name: 'scalar_subtraction',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
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
    'scalar_multiplication': {
        param_count: 2,
        func_name: 'scalar_multiplication',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
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
    'scalar_division': {
        param_count: 2,
        func_name: 'scalar_division',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_number],
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
    /**
     * Creates an array of function points. X coordinates will be in range(0, param1). Y coordinates will be param0.
     * Param 0 : the value to repeat
     * Param 1 : how many points to generate
     * Example:
     *  calling number_to_function_points(9.9, 3)
     *  returns [(0, 9.9), (1, 9.9), (2, 9.9)]
     */
    'scalar_to_function_points': {
        param_count: 2,
        func_name: 'scalar_to_function_points',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
        output_types: [datatype_def_1.data_types.dt_func_pt_series],
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
    /**
     * Given an array of function points, set y coordinate of each point to (1 + param0) * (y coordinate of the previous point)
     * Param 0 : interest rate
     * Param 2 : an array of function points
     */
    'apply_interest_rate': {
        param_count: 2,
        func_name: 'apply_interest_rate',
        param_types: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_func_pt_series],
        output_types: [datatype_def_1.data_types.dt_func_pt_series],
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
    }
};
exports.name_to_builtin_func = name_to_builtin_func;
