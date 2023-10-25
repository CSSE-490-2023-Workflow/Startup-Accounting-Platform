"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.func_interpreter = exports.func_2 = void 0;
// consider adding constraints to the first item, if it's a time
// maybe create a custom datatype that represents a time?
function to_series(val, length) {
    /**
     * Converts a number to an array of length 2 tuples
     * outputs: [[0, val], [1, val], [2, val], ... , [length-1, val]]
     */
    // check if length is integer
    var series_out = [];
    for (var i = 0; i < length; i++) {
        series_out[i] = [i, val];
    }
    return series_out;
}
var data_types;
(function (data_types) {
    data_types[data_types["dt_number"] = 0] = "dt_number";
    data_types[data_types["dt_func_pt_series"] = 1] = "dt_func_pt_series";
    data_types[data_types["dt_series"] = 2] = "dt_series";
})(data_types || (data_types = {}));
//type checking function for each data type
var declared_type_to_actual_type = {
    0: function (to_check) {
        return !isNaN(Number(to_check));
    },
    1: function (to_check) {
        if (!Array.isArray(to_check))
            return false;
        var res = true;
        to_check.forEach(function (val) {
            if (!Array.isArray(val)) {
                res = false;
            }
            if (val.length != 2) {
                res = false;
            }
            res && (res = !isNaN(Number(val[0])));
            res && (res = !isNaN(Number(val[1])));
        });
        return res;
    },
    2: function (to_check) {
        if (!Array.isArray(to_check))
            return false;
        var res = true;
        to_check.forEach(function (val) {
            res && (res = !isNaN(Number(to_check)));
        });
        return res;
    }
};
var test_var = [2, 4.0, 4.9];
console.log(declared_type_to_actual_type[2](test_var));
// let func_1 : custom_function = {
//     func_name : 'test_func1',
//     input_type: [data_types.dt_number, data_types.dt_number],
//     output_type: [data_types.dt_series],
//     param_idx: [false, false, false, false, false, false, true, true],
//     func_idx: [true, true, true, false, false, true, false, false],
//     operations: [9, 0, 2, 2, 4, 1, 0, 1],
// }
var func_2 = {
    func_name: 'test_func2',
    input_type: [data_types.dt_number, data_types.dt_number],
    output_type: [data_types.dt_number],
    param_idx: [false, false, true, true],
    func_idx: [true, true, false, false],
    operations: [0, 1, 1, 0],
};
exports.func_2 = func_2;
// series : [[1, 2], [2, 4], [3, 5]]
var FuncArgError = /** @class */ (function (_super) {
    __extends(FuncArgError, _super);
    function FuncArgError(msg) {
        return _super.call(this, msg) || this;
    }
    return FuncArgError;
}(Error));
var builtin_func_dict = {
    //addition for scalars
    1: {
        param_count: 2,
        func_name: 'scalar_addition',
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 0: scalar_addition receives two scalars as parameters');
            return Number(args[0]) + Number(args[1]);
        }
    },
    //subtraction
    2: {
        param_count: 2,
        func_name: 'scalar_subtraction',
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 1: scalar_substrating receives two scalars as parameters');
            return Number(args[0]) - Number(args[1]);
        }
    },
    //multiplication
    3: {
        param_count: 2,
        func_name: 'scalar_multiplication',
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 2: scalar_multiplication receives two scalars as parameters');
            return Number(args[0]) * Number(args[1]);
        }
    },
    //division
    4: {
        param_count: 2,
        func_name: 'scalar_division',
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 3: scalar_division receives two scalars as parameters');
            return Number(args[0]) / Number(args[1]);
        }
    },
    //number to function points
    5: {
        param_count: 2,
        func_name: 'number_to_function_points',
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!is_number(args[0]) || !is_integer(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 5: number_to_function_points receives one scalar and one integer as parameters');
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
            return series_out;
        }
    },
    //apply interest rate
    6: {
        param_count: 2,
        func_name: 'apply_interest_rate',
        func: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!declared_type_to_actual_type[0](args[0]) || !declared_type_to_actual_type[1](args[1]))
                throw new FuncArgError('Built in function 6: apply_interest_rate receives one scalar and one function points series as parameters');
            var rate = args[0];
            var ser = args[1];
            for (var i = 1; i < ser.length; i++) {
                ser[i][1] = (1 + rate) * ser[i - 1][1];
            }
            return ser;
        }
    }
};
/*
builtin_func_dict[0] = {param_count: 2, func : (p0: allowed_stack_components, p1 : allowed_stack_components) => {
    let p0_is_num : boolean = !isNaN(Number(p0));
    let p1_is_num : boolean = !isNaN(Number(p1));
    if (p0_is_num && p1_is_num) {
        return Number(p0) + Number(p1);
    } else if (p0_is_num & & !p1_is_num) {
        throw new Error('Two parameters must be the same type')
    } else if (!p0_is_num && p1_is_num) {
        throw new Error('Two parameters must be the same type')
    } else {
        const p0_entries = Object.entries(p0);
        const p1_entries = Object.entries(p1);
        if (p0_entries.length != p1_entries.length) {
            throw new Error('Two ')
        }
    }
    return p0 + p1;
}}
*/
function is_number(val) {
    return !isNaN(Number(val));
}
function is_integer(val) {
    return Number.isInteger(Number(val));
}
function type_check(expected, actual) {
}
function func_interpreter(func) {
    // TODO: check that the length of the arrays match
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // check declared param types and actual param types
    if (args.length !== func.input_type.length)
        throw new FuncArgError("function ".concat(func.func_name, ": expecting ").concat(func.input_type.length, " parameters, received ").concat(args.length));
    var operations_local = [];
    func.operations.forEach(function (val) { return operations_local.push(val); });
    var param_idx_local = Object.assign([], func.param_idx);
    var func_idx_local = Object.assign([], func.func_idx);
    console.log(operations_local);
    console.log(func.operations);
    // console.log(param_idx_local);
    // stores intermediate results
    var val_stack = [];
    // stores values to return
    var ret_vals = [];
    while (operations_local.length > 0) {
        console.log(val_stack);
        var top_1 = operations_local.pop();
        // this two cannot be true at the same time
        var is_func = func_idx_local.pop();
        var is_param = param_idx_local.pop();
        if (is_func) {
            console.log(top_1);
            if (!is_integer(top_1)) {
                throw new Error('Function index must be an integer');
            }
            if (Number(top_1) === 0) { // return a value
                var ret_val = val_stack.pop();
                if (ret_val === undefined)
                    throw new Error("Error when evaluating return value");
                // console.log(ret_val);
                ret_vals.push(ret_val);
                continue;
            }
            var param_count = builtin_func_dict[Number(top_1)].param_count;
            console.log(param_count);
            var args_1 = [];
            while (param_count > 0) {
                var arg = val_stack.pop();
                if (arg === undefined)
                    throw new Error("Error when evaluating built-in function ".concat(top_1));
                args_1.push(arg);
                param_count--;
            }
            console.log(args_1);
            var eval_res = (_a = builtin_func_dict[Number(top_1)]).func.apply(_a, args_1);
            console.log(eval_res);
            val_stack.push(eval_res);
        }
        else if (is_param) {
            if (!is_integer(top_1)) {
                throw new Error('Function argument index must be an integer');
            }
            val_stack.push(args[Number(top_1)]);
            console.log(val_stack);
        }
    }
    console.log(ret_vals);
    return ret_vals;
}
exports.func_interpreter = func_interpreter;
var rate = 0.1;
var arr = [[1, 9], [2, 9], [3, 9]];
var res = builtin_func_dict[6].func(rate, arr);
console.log(res);
/*
let operations_copy : allowed_stack_ops[] = [...func_1.operations];
console.log(func_1);
test_func(operations_copy);
console.log(func_1);
*/
