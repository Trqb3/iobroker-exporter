import ms from 'ms'
import { createServer } from './lib/server';
import { config } from './lib/setup';
import { Server } from "node:http";
import Logger from './lib/util/Logger';
import { updateMetrics } from './modules/Metrics';
import { loadObjectMetadata } from "./modules/helper/loadObjectMetadata";

console.log('=====================================');
console.log('ioBroker REST API Exporter');
console.log('made by admin@trqb3.dev')
console.log('=====================================');
console.log(`ioBroker Host  : ${config.IOBROKER_HOST}`);
console.log(`REST API Port  : ${config.REST_API_PORT}`);
console.log(`Exporter Port  : ${config.EXPORTER_PORT}`);
console.log(`Scrape Interval: ${ms(config.SCRAPE_INTERVAL, { long: true })}`);
console.log('=====================================');


const server: Server = createServer;
const logger = new Logger()

server.listen(config.EXPORTER_PORT, async (): Promise<void> => {
    console.log('');
    logger.write(0, `Exporter is running on port ${config.EXPORTER_PORT}`);
    logger.write(0, `Mertrics available at http://localhost:${config.EXPORTER_PORT}/metrics`);
    console.log('');

    await updateMetrics();
    setInterval(updateMetrics, config.SCRAPE_INTERVAL);
    setInterval(async (): Promise<void> => {
        logger.write(0, 'Reloading object metadata...');
        await loadObjectMetadata();
    }, ms('1h'));
});