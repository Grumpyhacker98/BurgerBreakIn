// Import MySQL connection.
var connection = require("../config/connection.js");


// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
    var arr = [];

    // loop through the keys and push the key/value as a string int arr
    for (var key in ob) {
        var value = ob[key];
        // check to skip hidden properties
        if (Object.hasOwnProperty.call(ob, key)) {
            // if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
            // cut out of the if statement to make it work 
            // || value.indexOf(" ") >= 0
            if (typeof value === "string") {
                value = "'" + value + "'";
            }
            // e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
            // e.g. {sleepy: true} => ["sleepy=true"]
            arr.push(key + "=" + value);
        }
    }

    // translate array of strings to a single comma-separated string
    return arr.toString();
}

function dataToNull(data) {
    if (data !== null) {
        var word = ", '" + data + "'"
        return word
    } else {
        var word = ", NULL"
        return word
    }
}


// Object for all our SQL statement functions.
const orm = {
    all: (tableInput) => {
        return new Promise((resolve, reject) => {
            var queryString = "SELECT * FROM " + tableInput + ";";
            connection.query(queryString, (err, result) => {
                if (err) return reject(err);
                resolve(result)
            });
        })
    },
    delete: (table, id) => {
        return new Promise((resolve, reject) => {
            var queryString = "DELETE FROM " + table + " WHERE ID = " + id
            connection.query(queryString, (err, result) => {
                if (err) return reject(err);
                resolve(result)
            });
        })
    },
    update: (data) => {
        return new Promise((resolve, reject) => {
            var queryString = "UPDATE " + data.table + " SET "
            if (data.table === "burger") {
                let values = {
                    name: data.Name,
                    bun: data.Bun,
                    ing1: ((data.Ing1) ? data.Ing1 : null),
                    ing2: ((data.Ing2) ? data.Ing2 : null),
                    ing3: ((data.Ing3) ? data.Ing3 : null),
                    ing4: ((data.Ing4) ? data.Ing4 : null),
                    ing5: ((data.Ing5) ? data.Ing5 : null),
                    ing6: ((data.Ing6) ? data.Ing6 : null),
                    ing7: ((data.Ing7) ? data.Ing7 : null),
                    ing8: ((data.Ing8) ? data.Ing8 : null),
                    ing9: ((data.Ing9) ? data.Ing9 : null),
                }
                queryString += objToSql(values)
            } else {
                let values = {
                    name: data.Name,
                    type: data.Type,
                    calories: data.Calories,
                    fats: data.Fats,
                    protein: data.Protein,
                    carbs: data.Carbs
                }
                queryString += objToSql(values)
            }
            queryString += " WHERE ID = " + data.id

            connection.query(queryString, (err, result) => {
                if (err) return reject(err);
                resolve(result)
            })
        })
    },
    create: (data) => {
        return new Promise((resolve, reject) => {
            var queryString = "INSERT INTO " + data.table
            if (data.table === "burger") {
                queryString += " (name, bun, ing1, ing2, ing3, ing4, ing5, ing6, ing7, ing8, ing9)"
                queryString += " VALUES ('" + data.Name + "','" + data.Bun + "'"
                queryString += dataToNull(data.Ing1) + dataToNull(data.Ing2)
                queryString += dataToNull(data.Ing3) + dataToNull(data.Ing4)
                queryString += dataToNull(data.Ing5) + dataToNull(data.Ing6)
                queryString += dataToNull(data.Ing7) + dataToNull(data.Ing8)
                queryString += dataToNull(data.Ing9) + ")"

                // queryString += "','" + data.Ing1 + "','" + data.Ing2 + "','" + data.Ing3
                // queryString += "','" + data.Ing4 + "','" + data.Ing5 + "','" + data.Ing6
                // queryString += "','" + data.Ing7 + "','" + data.Ing8 + "','" + data.Ing9 + "')"
            } else {
                queryString += " (name, type, Calories, Carbs, Protein, Fats) VALUES ('"
                queryString += data.Name + "','" + data.Type + "'," + data.Calories + ","
                queryString += data.Carbs + "," + data.Protein + "," + data.Fats + ")"
            }
            console.log(queryString)
            // resolve()
            connection.query(queryString, (err, result) => {
                if (err) { console.log(err), reject(err) }
                resolve(result)
            })
        })
    }
};

module.exports = orm;