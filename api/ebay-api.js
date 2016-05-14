//libs
var ebay = require('ebay-api');
var async = require('async');



var appId = "FransHol-Selleri-SBX-8d32f3572-74249cb1";
var AdDb = require('../dbmodels/admodel.js');
var SearchDB = require('../dbmodels/searchModel.js');
var defaultOptions = {
  minPrice: 0, 
  maxPrice: 1000, 
  locatedIn: 'US',
  pageNumber: 1, 
  entriesPerPage: 10
};
  /*
   *
   */
function search(query, opt){

  return new Promise(function(resolve, reject){

    var minPrice        = opt.minPrice || defaultOptions.minPrice;
    var maxPrice        = opt.maxPrice || defaultOptions.maxPrice;
    var locatedIn       = opt.locatedIn || defaultOptions.locatedIn;
    var pageNumber      = opt.pageNumber || defaultOptions.pageNumber;
    var entriesPerPage  = opt.entriesPerPage || defaultOptions.entriesPerPage

    var params = {
      keywords: [query],

      // add additional fields
      outputSelector: ['AspectHistogram'],

      paginationInput: {
        entriesPerPage: entriesPerPage,
        pageNumber: pageNumber
      },

      itemFilter: [
        {name: 'MinPrice', value: minPrice},
        {name: 'MaxPrice', value: maxPrice},
        {name: 'LocatedIn', value: locatedIn}
      ]
    };

    var options = {
          'serviceName' : 'Finding',
          'opType' : 'findItemsByKeywords',
          'appId' : appId,
          'params' : params,
          'sandbox' : true
    };


    ebay.xmlRequest(options, function(err, res){
      results = res.searchResult.item;
      normaliseAndSaveResult(results, query, function(err, searchObj){
        console.log("hej");
        if(err){
          reject(err);
        }else {
          resolve(searchObj);
        }
      });
    });
  });
}


function normaliseAndSaveResult(items, query, callback){
  console.log("hej");
  async.map(items, saveAd, function(err, res){
    if(err){
      callback(err, null);
    }else {
      var search = new SearchDB();
      search.searchQuery = query;
      search.ads = res;
      search.save(function(err, searchObj){
        callback(err, searchObj);
      });
    }
  });
}


function saveAd(item, callback){
  var loc = item.location.split(",");

  var adBody = {
    name: item.title,
    image: item.galleryURL,
    price: item.sellingStatus.currentPrice,
    fromSite: "Ebay",
    city: loc[0],
    country: item.country,
    url:item.country
  };

  var ad          = new AdDb(adBody);
  ad.save(function(err, createdAd){
    callback(createdAd)
  });

}
search("iPhone", defaultOptions).then(function(response){
  console.log("hej");
  console.log(response);
}, function(error){
  console.log(error);
});