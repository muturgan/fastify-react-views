import type { Server, IncomingMessage, ServerResponse } from 'http';
import type { Plugin, FastifyReply } from 'fastify';
import { engineFactory } from 'simple-react-viewengine';
import fp from 'fastify-plugin';
import HLRU from 'hashlru';


type TPlugin = Plugin<Server, IncomingMessage, ServerResponse, string>;
type TRes = FastifyReply<ServerResponse>;



const fastifyView: TPlugin = function(app, templateDir, done): void
{
   try {
      const lru = HLRU(100);
      const viewEngine = engineFactory(templateDir);


      const renderFile = <P extends {}>(templateName: string, props: P): string =>
      {
         const hashKey = templateName + '|' + JSON.stringify(props);

         const cached: string | undefined = lru.get(hashKey);
         if (cached) {
            return cached;
         }

         const html = viewEngine(templateName, props);

         lru.set(hashKey, html);

         return html;
      };


      const render = <P extends {}>(res: TRes, templateName: string, props: P): FastifyReply<ServerResponse> =>
      {
         try {
            const html = renderFile<P>(templateName, props);

            if (!res.getHeader('content-type')) {
               res.header('Content-Type', 'text/html; charset=utf8');
            }

            return res.send(html);

         } catch (er) {
            console.error(er);
            return res.status(500).send(new Error('template rendering error'));
         }
      };


      app.decorateReply('view', function<P extends {}>(templateName: string, props: P)
      {
         // @ts-ignore
         const res: TRes = this;
         render<P>(res, templateName, props);
      });

      done();

   } catch (err) {
      done(err);
   }
};

export const engine = fp(fastifyView, { fastify: '^2.x' });
