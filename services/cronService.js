const cron = require('node-cron');
const productPerformanceService = require('./productPerformanceService');

class CronService {
    constructor() {
        // Schedule product performance check every day at midnight
        this.performanceCheckJob = cron.schedule('0 0 * * *', async () => {
            console.log('Running daily product performance check...');
            try {
                const underperformingProducts = await productPerformanceService.checkProductPerformance();
                
                for (const productData of underperformingProducts) {
                    try {
                        await productPerformanceService.notifyAIAgent(productData);
                        console.log(`Notified AI agent about underperforming product: ${productData.productId}`);
                    } catch (error) {
                        console.error(`Failed to process underperforming product ${productData.productId}:`, error);
                    }
                }
            } catch (error) {
                console.error('Error in product performance cron job:', error);
            }
        });
    }

    startJobs() {
        this.performanceCheckJob.start();
        console.log('Cron jobs started');
    }

    stopJobs() {
        this.performanceCheckJob.stop();
        console.log('Cron jobs stopped');
    }
}

module.exports = new CronService();
