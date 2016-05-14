/*-----Handles the routing for a search requests-----*/
var Search = require('../dbmodels/searchModel');
var Promise = require('bluebird');
var traderaApi = require('../api/traderaApi');
var ebayApi = require('../api/ebay-api');
var Ad = require('../dbmodels/admodel');

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

      //Handle search criterion
      var match = {};
      //Should always search on a string
      match.searchQuery = req.query.searchQuery;

      //Handle filtering on max and minPrice
      if(req.query.minPrice || req.query.maxPrice){
        if(req.query.minPrice) match.minPrice = req.query.minPrice;
        if(req.query.maxPrice) match.maxPrice = req.query.maxPrice;
      }
      //Handle filtering on country
      if(req.query.country) match.country = req.query.country;
      console.log(match);

      Search.findOne(match).populate({path: 'ads', model: 'Ad'}).exec(function(err, query){
        console.log('Doing first query');
        if(err){
          console.log(err);
          return res.status(400).send('Internal problem');
        }
        var now = new Date();
        if(query && now - query.createdAt < 300000){
          //This query has exists and we can use the result
          return res.status(200).send(query.ads);
        }
        else{
          console.log('Creates new');
          var search = new Search();
          search.searchQuery = req.query.searchQuery;
          if(req.query.minPrice) search.minPrice = req.query.minPrice;
          if(req.query.maxPrice) search.maxPrice = req.query.maxPrice;
          if(req.query.country) search.country = req.query.country;
          search.save(function(err, data){
            console.log('saved');
            var traderaQuery = traderaApi.search(req.query.searchQuery, data._id);
            var ebayQuery = ebayApi.search(req.query.searchQuery, data._id);
            var apiQueries = Promise.all([ebayQuery, traderaQuery]);

            apiQueries.then(function(dataArray){
              Search.findById(data._id).populate({path: 'ads', model: 'Ad'}).exec(function(err, model){
                return res.status(200).send(model.ads);
              })
            })
          })
        }
      });

      //Get all the data to the specified search query
      //res.status(200).send('Hello Search!');
    })

  return router;
}
