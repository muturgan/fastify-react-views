"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_react_viewengine_1 = require("simple-react-viewengine");
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const hashlru_1 = __importDefault(require("hashlru"));
const fastifyView = function (app, options, done) {
    try {
        const lru = hashlru_1.default(100);
        const viewEngine = simple_react_viewengine_1.engineFactory(options.templateDir);
        const renderFile = (templateName, props) => {
            const hashKey = templateName + '|' + JSON.stringify(props);
            const cached = lru.get(hashKey);
            if (cached) {
                return cached;
            }
            const html = viewEngine(templateName, props);
            lru.set(hashKey, html);
            return html;
        };
        const render = (res, templateName, props) => {
            try {
                const html = renderFile(templateName, props);
                if (!res.getHeader('content-type')) {
                    res.header('Content-Type', 'text/html; charset=utf8');
                }
                return res.send(html);
            }
            catch (er) {
                console.error(er);
                return res.status(500).send(new Error('template rendering error'));
            }
        };
        app.decorateReply('view', function (templateName, props) {
            // @ts-ignore
            const res = this;
            render(res, templateName, props);
        });
        done();
    }
    catch (err) {
        done(err);
    }
};
exports.engine = fastify_plugin_1.default(fastifyView, { fastify: '^2.x' });
