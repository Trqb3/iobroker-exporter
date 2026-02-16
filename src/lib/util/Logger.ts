export default class Logger {
    public levels: Map<number, string>;

    /**
     * Creates a new instance of the Logger class.
     * @example
     * const logger = new Logger();
     * */
    constructor() {
        this.levels = new Map()
            .set(0, 'INFO')
            .set(1, 'WARN')
            .set(2, 'ERROR')
            .set(3, 'DEBUG');
    }

    /**
     * Logs a message to the console.
     * @param level Log level (0=INFO, 1=WARN, 2=ERROR, 3=DEBUG)
     * @param message The message to log
     * @param details Optional additional details
     * @example
     * logger.write(0, 'This is an info message');
     * logger.write(2, 'Error occurred', { code: 500 });
     * */
    public write(level: number, message: string, details?: any): void {
        const timestamp: string = new Date().toISOString();
        const logLevel: string | undefined = this.levels.get(level);

        if (!logLevel) throw new Error('Invalid log level');

        const logMessage = `${timestamp} - [${logLevel}] - ${message}${details ? ` - (${JSON.stringify(details)})` : ''}`;

        // Log to appropriate console method
        switch (level) {
            case 0: // INFO
                console.log(logMessage);
                break;
            case 1: // WARN
                console.warn(logMessage);
                break;
            case 2: // ERROR
                console.error(logMessage);
                break;
            case 3: // DEBUG
                console.debug(logMessage);
                break;
            default:
                console.log(logMessage);
        }
    }
}