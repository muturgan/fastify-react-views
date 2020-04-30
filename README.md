# fastify-react-views

This is an [Fastify][fastify] view engine which renders [React][react] components on server. It renders static markup and **does not** support mounting those views on the client.

This is intended to be used as a replacement for existing server-side view solutions, like jade, ejs, or handlebars.

Inspired by [express-react-views][express-react-views].


## Usage

```sh
npm install fastify fastify-react-views
```

### Add it to your app

```js
// app.js

const app = require('fastify')();
const { engine } = require('fastify-react-views');

app.register(engine, {
   templateDir: 'views'
});

app.get('/', (_, res) => res.send('ok'));

app.get('/test', (_, res) => res.view('hello', {text: 'World'}));

app.listen(3333, () => console.info('listening...'));
```

The first argument of the `view` method is the name of the template file, the second is props which are passed to your react component.  


### Typescript
When using typescript you can describe the type of your props.

```ts
// app.ts

interface IHello {
   text: string;
}

app.get('/test', (_, res) => {
   res.view<IHello>('hello', {text: 'World'});
});
```

### Nest.js
You can use it with [Nest.js][nest] as well.  
You need to register a plugin in your nest application.

```ts
// main.ts

import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { engine } from 'fastify-react-views';
import { AppModule } from './app.module';

async function bootstrap()
{
   const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
   );

   app.register(engine, {
      templateDir: 'views',
   });

   await app.listen(3333)
      .then(() => console.info(`listening...`));

   return app;
}
bootstrap();
```
Now you can use a Render decorator at your controllers.

```ts
// app.controller.ts

import { Controller, Get, Render } from '@nestjs/common';

interface IHello {
   text: string;
}

@Controller()
export class AppController {

   @Get()
   public index()
   {
      return 'Ok';
   }

   @Get('test')
   @Render('hello')
   public test(): IHello
   {
      return {text: 'World'};
   }
}
```


### Views

Under the hood, [Babel][babel] is used to compile your views to code compatible with your current node version, using the [react][babel-preset-react] and [env][babel-preset-env] presets by default. Only the files in your `views` directory (i.e. `app.register(engine, {templateDir: 'views'})`) will be compiled.

Your views should be node modules that export a React component. These files can have `js` or `jsx` extension.

```jsx
// hello.jsx
import * as React from 'react';

function Hello(props)  {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>App</title>
      </head>
      <body>
        <h2>Hello {props.text}!</h2>
      </body>
    </html>
  );
}

module.exports = Hello;
```


## License

Licensed under [MIT](./LICENSE).



[fastify]: https://www.fastify.io
[react]: https://reactjs.org
[express-react-views]: https://github.com/reactjs/express-react-views
[nest]: https://nestjs.com
[babel]: https://babeljs.io/
[babel-preset-react]: https://babeljs.io/docs/plugins/preset-react/
[babel-preset-env]: https://babeljs.io/docs/plugins/preset-env/
