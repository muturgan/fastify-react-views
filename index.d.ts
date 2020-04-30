/// <reference types="node" />
/// <reference types="fastify" />
import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { Plugin } from 'fastify';

declare module "fastify" {
  interface FastifyReply<HttpResponse> {
    view<P extends {}>(templateName: string, props: P): FastifyReply<HttpResponse>;
  }
}

export interface IEngineOptions {
  templateDir: string;
}

export declare const engine: Plugin<
  Server,
  IncomingMessage,
  ServerResponse,
  IEngineOptions
>;
