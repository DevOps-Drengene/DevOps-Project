require('express-async-errors');

process.on('unhandledRejection', (ex) => {
  throw ex;
});
