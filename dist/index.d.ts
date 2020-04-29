/// <reference types="node" />
/// <reference types="fastify" />
import type { Server, IncomingMessage, ServerResponse } from 'http';
declare const plugin: (instance: import("fastify").FastifyInstance<Server, IncomingMessage, ServerResponse>, options: string, callback: (err?: import("fastify").FastifyError | undefined) => void) => void;
export default plugin;
//# sourceMappingURL=index.d.ts.map