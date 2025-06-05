const clickhouse = require('clickhouse');

const client = new clickhouse({
    url: process.env.CLICKHOUSE_URL,
    port: process.env.CLICKHOUSE_PORT,
    username: process.env.CLICKHOUSE_USERNAME,
    password: process.env.CLICKHOUSE_PASSWORD,
});

const createTable = async () => {
    await client.query({
        query: `
            CREATE TABLE IF NOT EXISTS activity_log (
                id UInt64, 
                user_id UInt64, 
                action String, 
                created_at DateTime,
                product_id UInt64
            )   
            ENGINE = MergeTree() ORDER BY (id)
        `,
        format: 'JSON'
    }).then(res => {
        console.log('Table created successfully', res);
    });
}

const insertActivityLog = async (payload, type) => {
    try {
        await client.insert({
            table: 'activity_log',
            values: [
                [payload.id, payload.user_id, payload.action, payload.created_at, payload.product_id]
            ]
        });
    } catch (error) {
        console.error('Error inserting activity log:', error);
        throw error;
    }
}

ActivityLogService = {
    insertActivityLog,
    createTable
}

module.exports = ActivityLogService;