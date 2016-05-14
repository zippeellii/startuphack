/*-----Handles the routing for a search requests-----*/
var Search = require('../dbmodels/searchModel');

module.exports = function(app, express) {
  var router = express.Router();

  router.route('/search')
    .get(function(req, res){
      //Filter variables
      var minPrice, maxPrice;
      //Indexing variables
      var index, count;
      //Must have a search query
      if(!req.params.searchQuery){
        return res.status(400).send('Must specify a searchQuery');
      }
      if(!req.params.index){
        return res.status(400).send('Must specify index');
      }
      if(!req.params.count){
        return res.status(400).send('Must specify count');
      }
      if(req.params.minPrice) minPrice = req.params.minPrice;
      if(req.params.maxPrice) maxPrice = req.params.maxPrice;

      Search.findOne({searchQuery: req.params.searchQuery}).populate('ads').exec(function(err, query){
        if(err){
          res.status(400).send('Internal problem');
        }
        if(query){
          //For now, just return the ads
          res.send(query.ads);
          //This query has exists and we can use the result
        }
      });

      //Get all the data to the specified search query
      res.status(200).send('Hello Search!');
    })

  return router;
}
