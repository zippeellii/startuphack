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
      if(!req.query.searchQuery){
        return res.status(400).send('Must specify a searchQuery');
      }
      if(!req.query.index){
        return res.status(400).send('Must specify index');
      }
      if(!req.query.count){
        return res.status(400).send('Must specify count');
      }
      if(req.query.minPrice) minPrice = req.query.minPrice;
      if(req.query.maxPrice) maxPrice = req.query.maxPrice;

      Search.findOne({searchQuery: req.query.searchQuery}).populate('ads').exec(function(err, query){
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
