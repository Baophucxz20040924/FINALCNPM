const accountRouter = require('./account.router');
const documentRouter = require('./document.router');
const orderRouter = require('./order.router');

module.exports = (app) => {
  app.use('/api/accounts', accountRouter);
  app.use('/api/documents', documentRouter);
  app.use('/api/orders', orderRouter);
};
