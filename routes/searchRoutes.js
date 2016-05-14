//Handles the routing for a search requests

module.exports = function(app, express) {
  var router = express.Router();

  router.route('/search')
    .get(function(req, res){
      //Must have a search query
      //Filter variables
      var minPrice, maxPrice;
      if(!req.params.searchQuery){
        res.status(400).send('Must specify a searchQuery');
      }
      if(req.params.minPrice) minPrice = req.params.minPrice;
      if(req.params.maxPrice) maxPrice = req.params.maxPrice;

      //Get all the data to the specified search query
      res.status(200).send('Hello Search!');
    })

  return router;
}
