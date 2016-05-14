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

      if(err){
        reject(err);
      }
      
      var ads = results.map(item => {
        //var isAuction = true
        //var buyItNowPrice = 

        var loc = item.location.split(",");

        var adBody = {
          name: item.title,
          image: item.galleryURL,
          price: item.sellingStatus.currentPrice.amount,
          fromSite: "Ebay",
          city: loc[0],
          country: item.country,
          url:item.country,
          currency:item.sellingStatus.currentPrice.currencyId
        };

        var ad = new AdDb(adBody);

        ad.save();

        return ad._id;
      });

      var search = new SearchDB();
      search.searchQuery = query;
      search.ads = ads;
      search.createdAt = Date.now();
      search.save(function(err, result){
        if(err){
          resolve(undefined);
        }else{
          resolve(result._id);
        }
      });
    });
  });
}


module.exports.search;
