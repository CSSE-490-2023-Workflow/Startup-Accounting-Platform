type series_pt = [number, number]
// consider adding constraints to the first item, if it's a time
// maybe create a custom datatype that represents a time?
function to_series(val: number, length: number) {
    /**
     * Converts a number to an array of length 2 tuples
     * outputs: [[0, val], [1, val], [2, val], ... , [length-1, val]]
     */
    // check if length is integer
    let series_out : series_pt[] = [];
    for (let i = 0; i < length; i++) {
        series_out[i] = [i, val];
    }
    return series_out;
}

enum data_types {
    dt_number = 0,
    dt_func_pt_series,
    dt_series
}

//type checking function for each data type
let declared_type_to_actual_type : {[ind: number] : ((to_check : allowed_stack_components) => boolean)} = {

    0 : (to_check: allowed_stack_components) => {
        return !isNaN(Number(to_check));
    },

    1 : (to_check: allowed_stack_components) => {
        if (!Array.isArray(to_check)) 
            return false;
        let res: boolean = true;
        to_check.forEach((val: any) => {
            if (!Array.isArray(val)) {
                res = false;
            }
            if (val.length != 2) {
                res = false;
            }
            res &&= !isNaN(Number(val[0]));
            res &&= !isNaN(Number(val[1]));
        })
        return res;
    },

    2 : (to_check: allowed_stack_components) => {
        if (!Array.isArray(to_check)) 
            return false;
        let res: boolean = true;
        to_check.forEach((val: any) => {
            res &&= !isNaN(Number(to_check));
        })
        return res;
    }
}

let test_var : allowed_stack_components = [2, 4.0, 4.9];
console.log(declared_type_to_actual_type[2](test_var));
/*
enum params {
    p0 = 0,
    p1,
    p2
}

interface func_param {
    param_idx : number
}
*/

/*
enum builtin_funcs {
    f0 = 0,
    f1,
    f2
}
*/

type func_pt = [number, number]
type func_pt_series = Array<func_pt>
type series = Array<number>

type allowed_stack_components = number | func_pt_series | series 

interface custom_function {
    // TODO: add an id
    func_name : string,
    input_type : data_types[],
    output_type : data_types[],
    param_idx : boolean[],
    func_idx : boolean[],
    // operations to perform, maybe in prefix or postfix expression?
    // how to represent parameters and built-in functions?
    // 1. store strings
    // 2. store numbers only. Keep two additional bool arrays to track which number is a built-in function index and which one is a param index
    operations : allowed_stack_components[],
}

// let func_1 : custom_function = {
//     func_name : 'test_func1',
//     input_type: [data_types.dt_number, data_types.dt_number],
//     output_type: [data_types.dt_series],
//     param_idx: [false, false, false, false, false, false, true, true],
//     func_idx: [true, true, true, false, false, true, false, false],
//     operations: [9, 0, 2, 2, 4, 1, 0, 1],
// }

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

class FuncArgError extends Error {
    constructor(msg: string) {
        super(msg)
    }
}

interface builtin_function {
    // TODO add an id
    param_count : number;
    func_name: string;
    func: (...args : allowed_stack_components[]) => allowed_stack_components;
}

let builtin_func_dict : {[ind: number] : builtin_function} = {
    //addition for scalars
    1 : {
        param_count: 2, 
        func_name : 'scalar_addition',
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 0: scalar_addition receives two scalars as parameters')
            return Number(args[0]) + Number(args[1]);
        }
    },

    //subtraction
    2 : {
        param_count: 2, 
        func_name : 'scalar_subtraction',
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 1: scalar_substrating receives two scalars as parameters')
            return Number(args[0]) - Number(args[1]);
        }
    },

    //multiplication
    3 : {
        param_count: 2, 
        func_name : 'scalar_multiplication',
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 2: scalar_multiplication receives two scalars as parameters')
            return Number(args[0]) * Number(args[1]);
        }
    },

    //division
    4 : {
        param_count: 2, 
        func_name : 'scalar_division',
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 3: scalar_division receives two scalars as parameters')
            return Number(args[0]) / Number(args[1]);
        }
    },

    //number to function points
    5 : {
        param_count: 2, 
        func_name : 'number_to_function_points',
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_integer(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 5: number_to_function_points receives one scalar and one integer as parameters')
            const val : number = Number(args[0]);
            const length : number = Number(args[1]);
            /**
             * Converts a number to an array of length 2 tuples
             * outputs: [[0, val], [1, val], [2, val], ... , [length-1, val]]
             */
            // check if length is integer
            let series_out : series_pt[] = [];
            for (let i = 0; i < length; i++) {
                series_out[i] = [i, val];
            }
            return series_out;
        }
    },

    //apply interest rate
    6 : {
        param_count : 2,
        func_name : 'apply_interest_rate',
        func : (...args : allowed_stack_components[]) => {
            if (!declared_type_to_actual_type[0](args[0]) || !declared_type_to_actual_type[1](args[1]))
                throw new FuncArgError('Built in function 6: apply_interest_rate receives one scalar and one function points series as parameters');
            const rate : any = args[0];
            const ser  : any = args[1];
            for (let i = 1; i < ser.length; i++) {
                ser[i][1] = (1 + rate) * ser[i - 1][1];
            }
            return ser;
        }
    }

}

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


function is_number(val : any) {
    return !isNaN(Number(val));
}

function is_integer(val: any) {
    return Number.isInteger(Number(val));
}

function type_check(expected: data_types, actual: allowed_stack_components) {

}

export function func_interpreter(func : custom_function, ...args: allowed_stack_components[]) {
    
    // TODO: check that the length of the arrays match

    // check declared param types and actual param types
    if (args.length !== func.input_type.length) 
        throw new FuncArgError(`function ${func.func_name}: expecting ${func.input_type.length} parameters, received ${args.length}`);
    


    let operations_local : allowed_stack_components[] = [];
    func.operations.forEach(val => operations_local.push(val));
    let param_idx_local = Object.assign([], func.param_idx)
    let func_idx_local = Object.assign([], func.func_idx)
    console.log(operations_local)
    console.log(func.operations)
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
            let param_count = builtin_func_dict[Number(top)].param_count;
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
            let eval_res : allowed_stack_components = builtin_func_dict[Number(top)].func(...args);
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


let rate = 0.1;
let arr : func_pt_series = [[1, 9], [2, 9], [3, 9]];
let res = builtin_func_dict[6].func(rate, arr);
console.log(res);

/*
let operations_copy : allowed_stack_ops[] = [...func_1.operations];
console.log(func_1);
test_func(operations_copy);
console.log(func_1);
*/


