import { id_to_builtin_func } from "../engine/builtin_func_def"

const a = [[1, 5, 5], [2, 6, 6], [3, 7, 7]]
const b = [[1, 10], [2, 11], [3, 12]]
const c = [[1, 5, 5, 19], [2, 6, 6, 18], [3, 7, 7, 17], [5, 1, 1, 1]]
console.log(id_to_builtin_func['109'].func(a, b, c))