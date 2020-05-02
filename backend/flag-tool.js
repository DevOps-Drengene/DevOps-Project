process.env.PSQL_DB_NAME = 'minitwit';
process.env.PSQL_DB_USER_NAME = 'docker';
process.env.PSQL_DB_USER_PASSWORD = 'docker';
process.env.PSQL_HOST_NAME = 'db';

const yargs = require('yargs');
const db = require('./src/config/db');

// eslint-disable-next-line no-unused-expressions
yargs
  .command({
    command: 'i',
    desc: 'Dump all tweets and authors to STDOUT.',
    handler() {
      db.message.findAll().then((res) => {
        res.forEach((msg) => {
          console.log(`${msg.id} ${msg.userId} ${msg.text} ${msg.createdAt} ${msg.flagged}`);
        });
        process.exit(0);
      }).catch((err) => {
        console.log(`Failed to fetch messages... Error: ${err}`);

        process.exit(1);
      });
    },
  })
  .command({
    command: 'f <tweet_id>',
    desc: 'Flags a tweets with ID',
    builder: () => {
      yargs.positional('tweet_id', {
        type: 'number',
        demandOption: true,
      });
    },
    handler: (argv) => {
      db.message.update(
        { flagged: true },
        { where: { id: argv.tweet_id } },
      ).then((count) => {
        if (count === 0) console.log('No tweet with given id exists.');
        else console.log(`Tweet with id '${argv.tweet_id}' is now flagged.`);

        process.exit(0);
      }).catch(() => {
        console.log(`Failed to flag message with id '${argv.tweet_id}'.`);

        process.exit(1);
      });
    },
  })
  .demandCommand(1)
  .strict()
  .help()
  .parse();
