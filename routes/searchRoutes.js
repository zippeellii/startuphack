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
      var match = {};
      //Handle filtering on max and minPrice
      if(req.query.minPrice || req.query.maxPrice){
        match = { price: {} };
        if(req.query.minPrice) match.price.$gt = req.query.minPrice;
        if(req.query.maxPrice) match.price.$lt = req.query.maxPrice;
      }



      console.log(match);

      Search.findOne({searchQuery: req.query.searchQuery}).populate({path: 'ads', model: 'Ad', match}).exec(function(err, query){
        console.log('Query done');
        if(err){
          console.log(err);
          return res.status(400).send('Internal problem');
        }
        if(query){
          console.log('Search was found');
          console.log(query);
          return res.status(200).send(query.ads);
          //This query has exists and we can use the result
        }
        else{
          var search = new Search();
          search.searchQuery = req.query.searchQuery;
          search.save(function(err, data){
            console.log('saved');
            var traderaQuery = traderaApi.search(req.query.searchQuery, data._id);
            var ebayQuery = ebayApi.search(req.query.searchQuery, data._id);
            var apiQueries = Promise.all([ebayQuery, traderaQuery]);

            apiQueries.then(function(dataArray){
              Search.findById(data._id).populate({path: 'ads', model: 'Ad', match}).exec(function(err, model){
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
