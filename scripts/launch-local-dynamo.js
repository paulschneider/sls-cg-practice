const dbPath = "./scripts/database";

var flags = require('flags')
var localDynamo = require('../node_modules/local-dynamo/lib/launch.js')

flags.defineBoolean('inMemory', true, 'Run in memory, don\'t write data to disk')
flags.defineNumber('port', 8000, 'A port to run DynamoDB Local')
flags.defineBoolean('sharedDb', false, 'Use a single database file, instead of separate files for each credential and region')
flags.parse()

var childProcess = localDynamo.launch({
  dir: flags.get('inMemory') ? null : dbPath,
  sharedDb: flags.get('sharedDb'),
  stdio: 'pipe',
  detached: true,
}, flags.get('port'))
childProcess.stdout.pipe(process.stdout)
childProcess.stderr.pipe(process.stderr)

childProcess.on('error', function (e) {
  if (e.code === 'ENOENT') {
    console.error('Failed to start DynamoDB Local. Maybe because the database directory does not exist.')
  } else {
    console.error('Failed to start DynamoDB Local. Error:', e.message)
  }
})