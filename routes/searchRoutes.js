/*-----Handles the routing for a search requests-----*/
var Search = require('../dbmodels/searchModel');
var Promise = require('bluebird');
//var traderaApi = require('../api/traderaApi');
//var ebayApi = require('../api/ebayApi');

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
      //Dummy object
      var dummyObjects = [];
      var dummyObject = {
        name: 'iPhone5',
        image: 'http://cdn.gsmarena.com/vv/reviewsimg/apple-iphone-5/thumb_.jpg',
        description: 'Really nice iPhone, not used at all',
        price: 5000,
        fromSite: 'www.tradera.se',
        city: 'Gothenburg',
        country: 'Sweden',
        url: 'www.google.com',
        currency: 'SEK',
        isAuction: false

      }
      dummyObjects[0] = dummyObject;
      return res.status(200).send(dummyObjects);

      Search.findOne({searchQuery: req.query.searchQuery}).populate('ads').exec(function(err, query){
        console.log('Query done');
        if(err){
          res.status(400).send('Internal problem');
        }
        if(query){
          res.status(200).send(query.ads);
          //This query has exists and we can use the result
        }
        else{
          //var traderaQuery = traderaApi.search(req.params.searchQuery);
          //var ebayQuery = ebayApi.search(req.params.searchQuery);
          //var apiQueries = Promise.all(traderaQuery, ebayQuery);

          //apiQueries.then()
        }
      });

      //Get all the data to the specified search query
      res.status(200).send('Hello Search!');
    })

  return router;
}
