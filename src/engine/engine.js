"use strict";
// let func_1 : custom_function = {
//     func_name : 'test_func1',
//     input_type: [data_types.dt_number, data_types.dt_number],
//     output_type: [data_types.dt_series],
//     param_idx: [false, false, false, false, false, false, true, true],
//     func_idx: [true, true, true, false, false, true, false, false],
//     operations: [9, 0, 2, 2, 4, 1, 0, 1],
// }
Object.defineProperty(exports, "__esModule", { value: true });
exports.func_interpreter_new = void 0;
var builtin_func_def_1 = require("./builtin_func_def");
var error_def_1 = require("./error_def");
/**
 * When useOutput = 'all', a custom function evaluation will return a MAP in the form
 * {
 *  outputIdx : {
 *                  name : someName,
 *                  value : someValue
 *              }
 *  ...
 * }
 * a builtin function evaluation will return a LIST containing all outputs
 * When useOutput = some integer index, a function will
 * choose and return that specific output (as a plain value)
 * NOTE: this function is designed for evaluting a custom function
 * @param func_str json string representation of the custom function
 * @param args a map from input index to {name : inputName, value : inputValue}
 * @param funcCallStack a stack used to track all called functions. Used to verify if there is a nested call
 * @param customFuncDict a map from a custom function's id to its record in the DB
 * @returns Map<number, ioObj> if custom function, allowed_stack_components[] if builtin function, an allowed_stack_component otherwise
 * @throws NestedCallError if there is a nested function call (i.e. if a function calls itself, either directly or through some function it uses)
 */
var func_interpreter_new = function (func_str, args, funcCallStack, customFuncDict) {
    var _a;
    //console.log(func_str)
    var func_content = JSON.parse(func_str);
    if (func_content.type == 'custom_function') {
        //console.log(func_content)
        var outputDict = new Map();
        var counter = 1;
        for (var _i = 0, _b = func_content['outputs']; _i < _b.length; _i++) {
            var func_param = _b[_i];
            // This should return null
            var eval_res = func_interpreter_new(JSON.stringify(func_param), args, new Set(funcCallStack), customFuncDict);
            //console.log(`evalution of output no.${counter} finished. Got ${eval_res}`);
            outputDict.set(counter, { name: func_content.outputNames[counter - 1], value: eval_res });
            counter++;
        }
        if (Number.isInteger(func_content['useOutput'])) {
            if (func_content['useOutput'] > outputDict.size) {
                throw new Error("Function interpreter: output index ".concat(func_content['useOutput'], " out of range for ").concat(outputDict.size, " outputs"));
            }
            else {
                return outputDict.get(func_content['useOutput']).value;
            }
        }
        else if (func_content['useOutput'] = 'all') {
            return outputDict;
        }
        else {
            throw new Error('useOutput should either be the index of the output to use, or \'all\' to use all outputs');
        }
    }
    else if (func_content.type == 'custom_function_call') {
        //console.log('in custom function call')
        var paramDict = new Map();
        var counter = 1;
        if (funcCallStack.has(func_content.functionId)) {
            throw new error_def_1.NestedCallError("Nested function call. Please make sure that this function is not calling itself through the functions it uses");
        }
        else {
            funcCallStack.add(func_content.functionId);
        }
        for (var _c = 0, _d = func_content.params; _c < _d.length; _c++) {
            var param = _d[_c];
            var paramValue = func_interpreter_new(JSON.stringify(param), args, new Set(funcCallStack), customFuncDict);
            paramDict.set(counter, { name: func_content.paramNames[counter - 1], value: paramValue });
            counter++;
        }
        //console.log(customFuncDict)
        var record = customFuncDict.get(func_content.functionId);
        if (record == undefined) {
            throw new Error("Cannot find a custom function with id ".concat(func_content.functionId));
        }
        var customFuncBody = record.rawJson;
        var outputDict = func_interpreter_new(customFuncBody, paramDict, new Set(funcCallStack), customFuncDict);
        // Logics for selecting what output(s) to use
        if (Number.isInteger(func_content['useOutput'])) {
            if (func_content['useOutput'] > outputDict.size) {
                throw new Error("Function interpreter: output index ".concat(func_content['useOutput'], " out of range for ").concat(outputDict.size, " outputs"));
            }
            else {
                return outputDict.get(func_content['useOutput']).value;
            }
        }
        else if (func_content['useOutput'] = 'all') {
            return outputDict;
        }
        else {
            throw new Error('useOutput should either be the index of the output to use, or \'all\' to use all outputs');
        }
    }
    else if (func_content['type'] == 'output') {
        var outputEvalRes = func_interpreter_new(JSON.stringify(func_content['params'][0]), args, new Set(funcCallStack), customFuncDict);
        //console.log('evaluated output', outputEvalRes);
        //ret.set(func_content['outputIdx'], { name: func_content['outputName'], value: outputEvalRes });
        return outputEvalRes;
    }
    else if (func_content['type'] == 'builtin_function') {
        var param_arr = [];
        for (var _e = 0, _f = func_content['params']; _e < _f.length; _e++) {
            var func_param = _f[_e];
            var func_param_eval_res = func_interpreter_new(JSON.stringify(func_param), args, new Set(funcCallStack), customFuncDict);
            //console.log('evaluting', func_content['functionName'], ', param is:', func_param, ', evaluated param is:', func_param_eval_res);    
            param_arr.push(func_param_eval_res);
        }
        var func_eval_res = (_a = builtin_func_def_1.id_to_builtin_func[func_content['functionId']]).func.apply(_a, param_arr);
        // Logics for selecting what output(s) to use
        if (Number.isInteger(func_content['useOutput'])) {
            if (func_content['useOutput'] > func_eval_res.length) {
                throw new Error("Function interpreter: output index ".concat(func_content['useOutput'], " out of range for ").concat(func_eval_res.length, " outputs"));
            }
            else {
                //console.log('using output no.', func_content['useOutput'], ' of ', func_content['functionName'], '. It\'s evaluated to be: ', func_eval_res[func_content['useOutput']])
                return func_eval_res[func_content['useOutput'] - 1];
            }
        }
        else if (func_content['useOutput'] = 'all') {
            return func_eval_res;
        }
        else {
            throw new Error('useOutput should either be the index of the output to use, or \'all\' to use all outputs');
        }
    }
    else if (func_content['type'] == 'constant') {
        //console.log('in constant');
        return func_content['value'];
    }
    else if (func_content['type'] == 'input') {
        var arg = args.get(func_content['inputIdx']);
        if (arg == undefined) {
            throw new Error("User input no.".concat(func_content['inputIdx'], " not found in given argument dictionary."));
        }
        else {
            //console.log('Evaluated user input no.', func_content['inputIdx'], args)
            return arg['value'];
        }
    }
    else {
        //console.log(func_content)
        throw new Error("Unrecognized function component type");
    }
};
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
