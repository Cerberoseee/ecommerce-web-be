const clickhouse = require('clickhouse');

const client = new clickhouse.ClickHouse({
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

const getPopularProducts = async () => {
    try {
        const result = await client.query({
            query: `
                SELECT product_id, COUNT(*) as view_count 
                FROM activity_log 
                GROUP BY product_id 
                ORDER BY view_count 
                DESC LIMIT 10
            `,
            format: 'JSON'
        });

        if (result.data.length > 0) {
            return result.data;
        } else {
            return [];
        }
        
    } catch (error) {
        console.error('Error getting most viewed products:', error);
        return [];
    }
}

const getMostViewedProductsByUserId = async (user_id) => {
    try {
        const result = await client.query({
            query: `
                SELECT product_id, COUNT(*) as view_count 
                FROM activity_log 
                WHERE user_id = ${user_id} 
                GROUP BY product_id 
                ORDER BY view_count 
                DESC LIMIT 10
            `,
        });
        if (result.data.length > 0) {
            return result.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error getting most viewed products by user id:', error);
        return [];
    }
}

ActivityLogService = {
    insertActivityLog,
    createTable,
    getPopularProducts
}

module.exports = ActivityLogService;