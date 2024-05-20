const { createTestDb } = require('./test/mock-db');

let db;

function inTesting() {
    return process.env.JEST_WORKER_ID !== undefined;
}

async function mockClear() {
    if (db) {
        await db.close();
    }
    db = await createTestDb()
}

if (!inTesting()) {
    const {Pool} = require('pg');

    db = new Pool({
        user: 'EpokaAdmin',
        password: 'epoka',
        host: 'localhost',
        port: 5432,
        database: 'epoka_clubs'
    });

    module.exports = {
        query: (text, params) => db.query(text, params)
    };
} else {
    module.exports = {
        query: (text, params) => db.all(text, params),
        mockClear
    };
}
