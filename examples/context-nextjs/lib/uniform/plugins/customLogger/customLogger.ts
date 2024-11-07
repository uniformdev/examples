import rfdc from 'rfdc';
import { ContextPlugin, LogDrain } from '@uniformdev/context';
import { messageContent } from './messageContent';

const dc = rfdc();

export const customLogger = (): ContextPlugin => {
    const debugConsoleLogDrain = createDebugConsoleLogDrain();
    return { logDrain: debugConsoleLogDrain };
};

export function createDebugConsoleLogDrain(
): LogDrain {
    return ([severity, ...other]) => {
        const [id, ...params] = other;
        let consoleFunc = console[severity];

        // get message content from message id
        const messageFunc = messageContent[id];

        if (!messageFunc) {
            consoleFunc(
                `unknown event ID ${id}. Log messages data may be older than Uniform Context package.`,
                ...params
            );
            return;
        }

        // @ts-expect-error
        const [category, messageBody, ...outParams] = messageFunc(...params);
        consoleFunc(`[${category}] ${messageBody}\n`, ...outParams.map(dc));
    };
}
