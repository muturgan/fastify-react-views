/// <reference types="node" />
/// <reference types="fastify" />
import type { Server, IncomingMessage, ServerResponse } from 'http';
export declare const engine: (instance: import("fastify").FastifyInstance<Server, IncomingMessage, ServerResponse>, options: string, callback: (err?: import("fastify").FastifyError | undefined) => void) => void;
