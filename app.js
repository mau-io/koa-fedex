const http  = require('http'),
      Koa   = require('koa'),
      {routes, allowedMethods}  = require('./app/routes'),
      app   = new Koa();

const cors  = require('koa2-cors'),
  logger  = require('koa-pino-logger'),
  koaBody = require('koa-body'),
  serve   = require('koa-static');

const config  = require('./config.js'),
  conditional = require('./app/middleware/conditionalParameters'),
  parameter   = require('./app/middleware/parameter'),
  err         = require('./app/middleware/error');

// //////////////////////////////////////////////////////////
// Middlewares
// //////////////////////////////////////////////////////////  

app.use(err);
app.use(parameter(app));
app.use(conditional(app));

// //////////////////////////////////////////////////////////
// Modules
// //////////////////////////////////////////////////////////  

app.use(cors());
app.use(logger({
  level:"error",
  prettyPrint: true
}))

app.use(koaBody({
  jsonLimit: "5mb",
  formLimit: "5mb",
  textLimit: "5mb",
}));

app.use(serve('./public'));

// //////////////////////////////////////////////////////////
// Routes
// //////////////////////////////////////////////////////////

app.use(routes()); // Use the routes defined using the ./app/routes
app.use(allowedMethods());

// //////////////////////////////////////////////////////////
// DB SQLITE
// //////////////////////////////////////////////////////////
const sqlite = require('sqlite');
(async function(){
  const db = await sqlite.open('./database.sqlite');
  await db.all(`CREATE TABLE IF NOT EXISTS reports (id INTEGER PRIMARY KEY autoincrement, json JSON)`);
})()

const server = http.createServer(app.callback()).listen(config.SERVER.port,  () => {

  console.log(`
  \x1b[34m================================================================
  \x1b[36m API RUNNING  (ﾟｰﾟ)/
  \x1b[34m================================================================
  \x1b[36m NODE_ENV:          \x1b[0m ${process.env.NODE_ENV}
  \x1b[36m Listening at port: \x1b[0m ${config.SERVER.port} 
  \x1b[34m================================================================`);

});