"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data_type_name_to_enum = exports.data_type_enum_name_pairs = exports.declared_type_verifier = exports.data_types = exports.is_series = exports.is_integer = exports.is_number = void 0;
var data_types;
(function (data_types) {
    data_types[data_types["dt_number"] = 0] = "dt_number";
    data_types[data_types["dt_func_pt_series"] = 1] = "dt_func_pt_series";
    data_types[data_types["dt_series"] = 2] = "dt_series";
})(data_types || (exports.data_types = data_types = {}));
var data_type_enum_name_pairs = [
    [data_types.dt_number, "Number"],
    [data_types.dt_func_pt_series, "Function Points"],
    [data_types.dt_series, "Series"]
];
exports.data_type_enum_name_pairs = data_type_enum_name_pairs;
var data_type_name_to_enum = {};
exports.data_type_name_to_enum = data_type_name_to_enum;
data_type_name_to_enum["Number"] = data_types.dt_number;
data_type_name_to_enum["Function Points"] = data_types.dt_func_pt_series;
data_type_name_to_enum["Series"] = data_types.dt_series;
//type checking function for each data type
var declared_type_verifier = {
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
exports.declared_type_verifier = declared_type_verifier;
function is_number(val) {
    return !isNaN(Number(val));
}
exports.is_number = is_number;
function is_integer(val) {
    return Number.isInteger(Number(val));
}
exports.is_integer = is_integer;
function is_series(val) {
    if (!Array.isArray(val)) {
        return false;
    }
    for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
        var e = val_1[_i];
        if (!is_number(e)) {
            return false;
        }
    }
    return true;
}
exports.is_series = is_series;
