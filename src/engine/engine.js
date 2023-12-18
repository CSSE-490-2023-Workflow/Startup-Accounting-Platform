"use strict";
// let func_1 : custom_function = {
//     func_name : 'test_func1',
//     input_type: [data_types.dt_number, data_types.dt_number],
//     output_type: [data_types.dt_series],
//     param_idx: [false, false, false, false, false, false, true, true],
//     func_idx: [true, true, true, false, false, true, false, false],
//     operations: [9, 0, 2, 2, 4, 1, 0, 1],
// }
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
exports.func_interpreter_new = exports.func_interpreter_new_caller = exports.func_2 = void 0;
var datatype_def_1 = require("./datatype_def");
var builtin_func_def_1 = require("./builtin_func_def");
var error_def_1 = require("./error_def");
var func_2 = {
    func_name: 'test_func2',
    input_type: [datatype_def_1.data_types.dt_number, datatype_def_1.data_types.dt_number],
    output_type: [datatype_def_1.data_types.dt_number],
    param_idx: [false, false, true, true],
    func_idx: [true, true, false, false],
    operations: [0, 1, 1, 0],
};
exports.func_2 = func_2;
// series : [[1, 2], [2, 4], [3, 5]]
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
//deprecated
/*
export function func_interpreter(func : custom_function, ...args: allowed_stack_components[]) {
    
    // TODO: check that the length of the arrays match

    // check declared param types and actual param types
    if (args.length !== func.input_type.length)
        throw new FuncArgError(`function ${func.func_name}: expecting ${func.input_type.length} parameters, received ${args.length}`);
    


    let operations_local : allowed_stack_components[] = [];
    func.operations.forEach(val => operations_local.push(val));
    let param_idx_local = Object.assign([], func.param_idx)
    let func_idx_local = Object.assign([], func.func_idx)
    //console.log(operations_local)
    //console.log(func.operations)
    // console.log(param_idx_local);
    // stores intermediate results
    let val_stack : allowed_stack_components[] = [];

    // stores values to return
    let ret_vals : allowed_stack_components[] = [];

    while (operations_local.length > 0) {
        console.log(val_stack)
        let top = operations_local.pop();
        // this two cannot be true at the same time
        let is_func = func_idx_local.pop();
        let is_param = param_idx_local.pop();
        if (is_func) {
            console.log(top);
            if (!is_integer(top)) {
                throw new Error('Function index must be an integer')
            }
            if (Number(top) === 0) { // return a value
                let ret_val : allowed_stack_components | undefined = val_stack.pop();
                if (ret_val === undefined)
                    throw new Error(`Error when evaluating return value`);
                // console.log(ret_val);
                ret_vals.push(ret_val);
                continue;
            }
            let param_count = id_to_builtin_func[Number(top)].param_count;
            console.log(param_count);
            let args : allowed_stack_components[] = [];
            while (param_count > 0) {
                let arg = val_stack.pop();
                if (arg === undefined)
                    throw new Error(`Error when evaluating built-in function ${top}`);
                args.push(arg);
                param_count--;
            }
            console.log(args);
            let eval_res : allowed_stack_components[] = id_to_builtin_func[Number(top)].func(...args);
            console.log(eval_res);
            val_stack.push(eval_res);
        } else if (is_param) {
            if (!is_integer(top)) {
                throw new Error('Function argument index must be an integer');
            }
            val_stack.push(args[Number(top)]);
            console.log(val_stack);
        }

    }
    console.log(ret_vals);
    return ret_vals;

    
}
*/
function func_interpreter_new_caller(func_str) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var ret = [];
    func_interpreter_new.apply(void 0, __spreadArray([func_str, ret], args, false));
    return ret;
}
exports.func_interpreter_new_caller = func_interpreter_new_caller;
function func_interpreter_new(func_str, ret) {
    var _a;
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var func_content = JSON.parse(func_str);
    console.log(func_content);
    if (func_content['type'] == 'builtin_function' && func_content['name'] == 'return') {
        console.log("in function, return");
        console.log(func_content['param'][0]);
        var ret_arr = [];
        for (var _b = 0, _c = func_content['param']; _b < _c.length; _b++) {
            var func_param = _c[_b];
            var eval_res = func_interpreter_new.apply(void 0, __spreadArray([JSON.stringify(func_param), ret], args, false));
            console.log('pushed', eval_res);
            ret.push(eval_res);
        }
        return ret;
    }
    else if (func_content['type'] == 'builtin_function') {
        console.log("in function, not return");
        var param_arr = [];
        for (var _d = 0, _e = func_content['param']; _d < _e.length; _d++) {
            var func_param = _e[_d];
            console.log('func_param', func_param);
            var func_param_eval_res = func_interpreter_new.apply(void 0, __spreadArray([JSON.stringify(func_param), ret], args, false));
            console.log('func_param_eval_res', func_param_eval_res);
            param_arr.push(func_param_eval_res);
        }
        var func_eval_res = (_a = builtin_func_def_1.name_to_builtin_func[func_content['name']]).func.apply(_a, param_arr);
        console.log(func_eval_res);
        return func_eval_res.length == 1 ? func_eval_res[0] : func_eval_res;
    }
    else if (func_content['type'] == 'constant') {
        console.log('in constant');
        return func_content['value'];
    }
    else if (func_content['type'] == 'argument') {
        console.log("in argument");
        return args[func_content['index']];
    }
    else {
        throw new error_def_1.FuncArgError("Unrecognized function component type : ".concat(func_content));
    }
}
exports.func_interpreter_new = func_interpreter_new;
/*
let rate = 0.1;
let arr : func_pt_series = [[1, 9], [2, 9], [3, 9]];
let res = builtin_func_dict[6].func(rate, arr);
console.log(res);


let operations_copy : allowed_stack_ops[] = [...func_1.operations];
console.log(func_1);
test_func(operations_copy);
console.log(func_1);
*/
//console.log(name_to_builtin_func['apply_interest_rate'].func_name)
