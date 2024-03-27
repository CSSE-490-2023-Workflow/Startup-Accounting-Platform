// let func_1 : custom_function = {
//     func_name : 'test_func1',
//     input_type: [data_types.dt_number, data_types.dt_number],
//     output_type: [data_types.dt_series],
//     param_idx: [false, false, false, false, false, false, true, true],
//     func_idx: [true, true, true, false, false, true, false, false],
//     operations: [9, 0, 2, 2, 4, 1, 0, 1],
// }

import {data_types} from './datatype_def'
import type {allowed_stack_components, custom_function} from './datatype_def'
import { id_to_builtin_func } from './builtin_func_def';
import { NestedCallError } from './error_def';

let func_2 : custom_function = {
    func_name : 'test_func2',
    input_type: [data_types.dt_number, data_types.dt_number],
    output_type: [data_types.dt_number],
    param_idx: [false, false, true, true],
    func_idx: [true, true, false, false],
    operations: [0, 1, 1, 0],
}
export { func_2 };
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

interface ioObj {
    name : string,
    value: allowed_stack_components
}

/**
 * Deprecated. Use func_interpreter_new instead
 * Evaluates a custom function
 * @param func_str JSON string representation of the custom function
 * @param args a map from input index to {name : inputName, value : inputValue}
 * @returns a map from output index to {name : outputName, value : outputValue}
 */
export function func_interpreter_new_caller(func_str : string, args: Map<number, ioObj>) {
    return func_interpreter_new(func_str, args);
}

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
 * When output = some integer, both builtin function and custom function will return a plain value
 * NOTE: this function is designed for evaluting a custom function
 * @param func_str json string representation of the custom function
 * 
 * @param args a map from input index to {name : inputName, value : inputValue}
 * @returns Map<number, ioObj> if custom function, allowed_stack_components[] if builtin function, an allowed_stack_component otherwise
 * @throws NestedCallError if there is a nested function call (i.e. if a function calls itself, either directly or through some function it uses)
 */
const func_interpreter_new : any = function(func_str: string, args: Map<number, ioObj>, funcCallStack: Set<string>) {
    //console.log(func_str)
    const func_content = JSON.parse(func_str);
    if (func_content.type == 'custom_function') {
        //console.log("in function, return");
        //console.log(func_content['param'][0]);
        //const ret_arr : allowed_stack_components[] = [];
        const outputDict : Map<number, ioObj> = new Map();
        let counter : number = 1;
        for (const func_param of func_content['outputs']) {
            // This should return null
            const eval_res : any = func_interpreter_new(JSON.stringify(func_param), args, funcCallStack);
            //console.log(`evalution of output no.${counter} finished. Got ${eval_res}`);
            outputDict.set(counter, { name : func_content.outputNames[counter - 1], value : eval_res})
            counter++;
        }
        if (Number.isInteger(func_content['useOutput'])) {
            if (func_content['useOutput'] > outputDict.size) {
                throw new Error(`Function interpreter: output index ${func_content['useOutput']} out of range for ${outputDict.size} outputs`);
            } else {
                return (outputDict.get(func_content['useOutput']) as ioObj).value;
            }
        } else if (func_content['useOutput'] = 'all') {
            return outputDict;
        } else {
            throw new Error('useOutput should either be the index of the output to use, or \'all\' to use all outputs');
        }
    } else if (func_content.type == 'custom_function_call') {
        console.log('in custom function call')
        const paramDict : Map<number, ioObj> = new Map();
        let counter : number = 1;
        console.log(funcCallStack)
        if (funcCallStack.has(func_content.functionId)) {
            throw new NestedCallError("Nested function call. Please make sure that this function is not calling itself through the function it uses")
        } else {
            funcCallStack.add(func_content.functionId)
        }
        for (const param of func_content.params) {
            const paramValue : any = func_interpreter_new(JSON.stringify(param), args, funcCallStack);
            paramDict.set(counter, {name : func_content.paramNames[counter - 1], value : paramValue});
            counter++;
        } 
        const outputDict : Map<number, ioObj> = func_interpreter_new(func_content.body, paramDict, funcCallStack);
        

        // Logics for selecting what output(s) to use
        if (Number.isInteger(func_content['useOutput'])) {
            if (func_content['useOutput'] > outputDict.size) {
                throw new Error(`Function interpreter: output index ${func_content['useOutput']} out of range for ${outputDict.size} outputs`);
            } else {

                return (outputDict.get(func_content['useOutput']) as ioObj).value;
            }
        } else if (func_content['useOutput'] = 'all') {
            return outputDict;
        } else {
            throw new Error('useOutput should either be the index of the output to use, or \'all\' to use all outputs');
        }

    } else if (func_content['type'] == 'output') {
        const outputEvalRes : any = func_interpreter_new(JSON.stringify(func_content['params'][0]), args, funcCallStack);
        //console.log('evaluated output', outputEvalRes);
        //ret.set(func_content['outputIdx'], { name: func_content['outputName'], value: outputEvalRes });
        return outputEvalRes;
    } else if (func_content['type'] == 'builtin_function') {
        let param_arr : allowed_stack_components[] = [];
        for (const func_param of func_content['params']) {
        
            const func_param_eval_res : allowed_stack_components = func_interpreter_new(JSON.stringify(func_param), args, funcCallStack);
            //console.log('evaluting', func_content['functionName'], ', param is:', func_param, ', evaluated param is:', func_param_eval_res);    
            param_arr.push(func_param_eval_res);
        }
        const func_eval_res : allowed_stack_components[] = id_to_builtin_func[func_content['functionId']].func(...param_arr);
        
        // Logics for selecting what output(s) to use
        if (Number.isInteger(func_content['useOutput'])) {
            if (func_content['useOutput'] > func_eval_res.length) {
                throw new Error(`Function interpreter: output index ${func_content['useOutput']} out of range for ${func_eval_res.length} outputs`);
            } else {
                //console.log('using output no.', func_content['useOutput'], ' of ', func_content['functionName'], '. It\'s evaluated to be: ', func_eval_res[func_content['useOutput']])
                return func_eval_res[func_content['useOutput'] - 1]
            }
        } else if (func_content['useOutput'] = 'all') {
            return func_eval_res;
        } else {
            throw new Error('useOutput should either be the index of the output to use, or \'all\' to use all outputs');
        }
    } else if (func_content['type'] == 'constant') {
        //console.log('in constant');
        return func_content['value'];
    } else if (func_content['type'] == 'input') {
        const arg : ioObj | undefined = args.get(func_content['inputIdx'])
        if (arg == undefined) {
            throw new Error(`User input no.${func_content['inputIdx']} not found in given argument dictionary.`);
        } else {
            //console.log('Evaluated user input no.', func_content['inputIdx'], args)
            return arg['value'];
        }
    } else {
        //console.log(func_content)
        throw new Error(`Unrecognized function component type`);
    } 

}

export {func_interpreter_new}




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


