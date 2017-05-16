const json2insert = function(table, obj) {
    if (typeof obj !== "object")
        throw "Bad argument!";
    let keys = [];
    for (let key in obj) {
        key = '[' + key + ']';
        keys.push(key);
    }
    let values = [];
    for (let key in obj) {
        let value = obj[key];
        if (typeof value === "string")
            value = '"' + value + '"';
        values.push(value);
    }
    return `INSERT INTO [${table}] (${keys.join(", ")}) VALUES (${values.join(", ")});`;
};

const json2update = function(table, rowid, obj) {
    if (typeof obj !== "object")
        throw "Bad argument!";
    let pairs = [];
    for (let key in obj) {
        let value = obj[key];
        if (typeof value === "string")
            value = '"' + value + '"';
        key = '[' + key + ']';
        pairs.push(`${key} = ${value}`);
    }
    return `UPDATE [${table}] SET ${pairs.join(", ")} WHERE rowid = ${rowid};`;
};

// const person = {
//     name: "Some Name",
//     height: 180,
//     age: 30,
//     isManager: false
// };
// console.log(json2insert("person", person));
// console.log(json2update("person", 1, person));

exports.json2insert = json2insert;
exports.json2update = json2update;