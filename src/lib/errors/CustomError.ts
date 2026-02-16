import util from 'node:util';
import { ErrorCodes } from './ErrorCodes';
import { Messages } from './Messages';

/**
 * Extends an error class to include a code property and a custom message.
 * @param Base The base error class to extend.
 * @returns The extended error class.
 * */
function makeCustomError(Base: ErrorConstructor) {
    return class CustomError extends Base {
        public code: string;

        constructor(code: ErrorCodes, ...args: any[]) {
            const msg: string = message(code, args);
            super(msg);
            this.code = code;
            Error.captureStackTrace?.(this, CustomError);
        }

        get name(): string {
            return `${super.name} [${this.code}]`;
        }
    }
}

/**
 * Formats a message with the provided arguments.
 * @param code The error code.
 * @param args The arguments to format the message with.
 * @returns The formatted message.
 * */
function message(code: ErrorCodes, args: any): string {
    if (!(code in ErrorCodes)) throw new Error('Error code must be a valid DcbErrorCodes');
    const msg: string = Messages[code];
    if (!msg) throw new Error(`No message associated with error code: ${code}.`);
    if (!args?.length) return msg;
    args.unshift(msg);
    return util.format(...args);
}

export class CustomError extends makeCustomError(Error) {}
export class CustomTypeError extends makeCustomError(TypeError) {}
export class CustomRangeError extends makeCustomError(RangeError) {}