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

/*const person = {
    name: "Some Name",
    height: 180,
    age: 30,
    isManager: false
};
console.log(json2insert("person", person));*/

exports.json2insert = json2insert;