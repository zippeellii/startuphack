module.exports = {
  'database': 'localhost/temp:port', //The database
  'port': process.ENV.port || 8080 //Use the env port if specified
}
