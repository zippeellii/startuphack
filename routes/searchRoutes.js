//Handles the routing for a search requests

module.exports = function(app, express) {
  var router = express.Router();

  router.route('search')
    .get(function(req, res){
      res.status(200).send('Hello Search!');
    })
}
