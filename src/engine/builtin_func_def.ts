import { data } from 'jquery'
import {data_types, declared_type_verifier, is_integer, is_number, is_series} from './datatype_def'
import type {func_pt, func_pt_series, series, allowed_stack_components, custom_function, builtin_function} from './datatype_def'
import { FuncArgError } from './error_def'

export {id_to_builtin_func} //name_to_builtin_func}

let id_to_builtin_func : {[id: string] : builtin_function} = {
    //addition for scalars
    '101' : {
        param_count: 2, 
        func_name : 'scalar_addition',
        param_types : [[data_types.dt_number, data_types.dt_number], [data_types.dt_series, data_types.dt_series]],
        param_names : ['addend_1', 'addend_2'],
        output_types : [[data_types.dt_number], [data_types.dt_series]],
        output_names : ['sum'],
        func : (...args : allowed_stack_components[]) => {
            if (is_number(args[0]) && is_number(args[1])) {
                return [(args[0] as number) + (args[1] as number)];
            } else if (is_series(args[0]) && is_series(args[1])) {
                const ser1 : series = args[0] as series;
                const ser2 : series = args[1] as series;
                const ser3 : series = []
                if (ser1.length != ser2.length) {
                    throw new Error(`scalar_addition: input series must be the same length`)
                }
                for (let i = 0; i < ser1.length; i++) {
                    ser3[i] = ser1[i] + ser2[i];
                }
                return [ser3];
            } else {
                throw new Error(`scalar_addition: unknown input types`)
            }
        }
    },

    //subtraction
    '102' : {
        param_count: 2, 
        func_name : 'scalar_subtraction',
        param_types : [[data_types.dt_number, data_types.dt_number]],
        param_names : ['minuend', 'subtrahend'],
        output_types : [[data_types.dt_number]],
        output_names : ['difference'],
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 1: scalar_substrating receives two scalars as parameters')
            return [Number(args[0]) - Number(args[1])];
        }
    },

    //multiplication
    '103' : {
        param_count: 2, 
        func_name : 'scalar_multiplication',
        param_types : [[data_types.dt_number, data_types.dt_number]],
        param_names : ['multiplicand', 'multiplier'],
        output_types : [[data_types.dt_number]],
        output_names : ['product'],
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 2: scalar_multiplication receives two scalars as parameters')
            return [Number(args[0]) * Number(args[1])];
        }
    },

    //division
    '104' : {
        param_count: 2, 
        func_name : 'scalar_division',
        param_types : [[data_types.dt_number, data_types.dt_number]],
        param_names : ['dividend', 'divisor'],
        output_types : [[data_types.dt_number]],
        output_names : ['quotient'],
        func : (...args : allowed_stack_components[]) => {
            if (!is_number(args[0]) || !is_number(args[1]) || args.length !== 2)
                throw new FuncArgError('Built in function 3: scalar_division receives two scalars as parameters')
            return [Number(args[0]) / Number(args[1])];
        }
    },

    //number to function points
    '105' : {
        param_count: 2, 
        func_name : 'scalar_to_function_points',
        param_types : [[data_types.dt_number, data_types.dt_number]],
        param_names : ['value', 'length'],
        output_types : [[data_types.dt_double_series]],
        output_names : ['func pts'],
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
            let series_out : func_pt_series = [];
            for (let i : number = 0; i < length; i++) {
                series_out[i] = [i, val];
            }
            return [series_out];
        }
    },

    //apply interest rate
    '106' : {
        param_count : 2,
        func_name : 'apply_interest_rate',
        param_types : [[data_types.dt_number, data_types.dt_double_series]],
        param_names : ['interest rate', 'func pts'],
        output_types : [[data_types.dt_double_series]],
        output_names : ['func pts'],
        func : (...args : allowed_stack_components[]) => {
            if (!declared_type_verifier[0](args[0]) || !declared_type_verifier[1](args[1]))
                throw new FuncArgError('Built in function 6: apply_interest_rate receives one scalar and one function points series as parameters');
            const rate : any = args[0];
            const ser  : any = args[1];
            for (let i = 1; i < ser.length; i++) {
                ser[i][1] = (1 + rate) * ser[i - 1][1];
            }
            return [ser];
        }
    },

    '107': {
        param_count: 1,
        func_name: 'test_func',
        param_types : [[data_types.dt_number]],
        param_names : ['param 1'],
        output_types: [[data_types.dt_number, data_types.dt_number, data_types.dt_series]],
        output_names : ['output 1', 'output 2', 'output 3'],
        func: (...args : allowed_stack_components[]) => {
            return [1];
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
        func_name: 'Merge double series',
        param_types : [[data_types.dt_double_series, data_types.dt_double_series]],
        param_names : ['double series 1', 'double series 2'],
        output_types: [[data_types.dt_double_series]],
        output_names : ['merged series'],
        func: (...args : allowed_stack_components[]) => {
            console.log(args)
            if (!declared_type_verifier[1](args[0]) || !declared_type_verifier[1](args[1]))
                throw new FuncArgError('Merge double series receives two double series as parameters');
            const m = new Map<number, number>()
            const dser1 = args[0] as number[][]
            const dser2 = args[1] as number[][]
            for (let pt of dser1) {
                m.set(pt[0], m.has(pt[0]) ? Number(m.get(pt[0])) + pt[1] : pt[1])
            }
            for (let pt of dser2) {
                m.set(pt[0], m.has(pt[0]) ? Number(m.get(pt[0])) + pt[1] : pt[1])
            }
            const res = Array.from(m)
            res.sort((a, b) => a[0] - b[0])
            return [res];
        }
    }

}

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