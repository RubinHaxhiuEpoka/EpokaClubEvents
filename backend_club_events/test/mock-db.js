const sqlite3 = require('sqlite3');
const {open} = require('sqlite');

const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const seedFile = "seed-database.sql";

async function createTestDb() {
    
    const seedSql = await readFile(seedFile, 'utf8');

    const db = open({
        filename: ':memory:',
        driver: sqlite3.Database
    });

    await db.exec(seedSql);

    return db;
}

module.exports = {
    createTestDb
}