const app = require('./custom-server');
const db = require('./config/db');

const port = process.env.PORT || 5001;

// Sync DB before launching server
db.sequelize.sync().catch((err) => console.error(`DB initialize error: ${err}`)).finally(() => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
});
