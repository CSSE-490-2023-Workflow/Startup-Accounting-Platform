enum data_types {
    dt_number = 0,
    dt_func_pt_series,
    dt_series
}

type func_pt = [number, number]
type func_pt_series = Array<func_pt>
type series = Array<number>

type allowed_stack_components = number | func_pt_series | series 

const data_type_enum_name_pairs: [data_types, string][] = [
    [data_types.dt_number, "Number"], 
    [data_types.dt_func_pt_series, "Function Points"],
    [data_types.dt_series, "Series"]
];

const data_type_name_to_enum : {[name: string] : number} = {};   

data_type_name_to_enum["Number"] = data_types.dt_number;
data_type_name_to_enum["Function Points"] = data_types.dt_func_pt_series;
data_type_name_to_enum["Series"] = data_types.dt_series;

//type checking function for each data type
let declared_type_verifier : {[ind: number] : ((to_check : allowed_stack_components) => boolean)} = {

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

//deprecated
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

interface builtin_function {
    // TODO add an id
    param_count : number;
    func_name: string;
    param_types: data_types[];
    output_types: data_types[];
    func: (...args : allowed_stack_components[]) => allowed_stack_components[];
}

export function is_number(val : any) {
    return !isNaN(Number(val));
}

export function is_integer(val: any) {
    return Number.isInteger(Number(val));
}

//export * from './datatype_def'

export { data_types, declared_type_verifier }
export { data_type_enum_name_pairs, data_type_name_to_enum }
export type {func_pt, func_pt_series, series, allowed_stack_components, custom_function, builtin_function}