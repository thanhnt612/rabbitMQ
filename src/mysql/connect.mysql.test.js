const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'devtest'
})

const batchSize = 100_000;
const totalSize = 10_000_000;

// const batchSize = 100_000;
// const totalSize = 10_000_000;

let currentId = 1;
console.time(':::::TIMER:::::')
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`
        const age = currentId
        const address = `address-${currentId}`
        values.push([currentId, name, age, address])
        currentId++
    }
    if (!values.length) {
        console.timeEnd(':::::TIMER:::::')
        pool.end(err => {
            if (err) {
                console.log(`error occured while running batch`);
            } else {
                console.log(`Connection pool closed successfully`);
            }
        })
        return;
    }
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`
    pool.query(sql, [values], async function (err, result) {
        if (err) throw err
        console.log(`Inserted ${result.affectedRows} records`);
        await insertBatch()
    })
}

insertBatch().catch(console.error)