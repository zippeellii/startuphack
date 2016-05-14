//libs
var ebay = require('ebay-api');
var async = require('async');



var appId = "FransHol-Selleri-PRD-7d2ce5828-795d2a58";
var AdDb = require('../dbmodels/admodel.js');
var SearchDB = require('../dbmodels/searchModel.js');

var exports = module.exports;

exports.search = function(searchId, opt){

  return new Promise(function(resolve, reject){
    var defaultOptions = {
      minPrice: 0,
      maxPrice: 100000,
      locatedIn: 'US',
      pageNumber: 1,
      entriesPerPage: 50
    };
    opt = opt || {};

    var minPrice        = opt.minPrice || defaultOptions.minPrice;
    var maxPrice        = opt.maxPrice || defaultOptions.maxPrice;
    var locatedIn       = opt.locatedIn || defaultOptions.locatedIn;
    var pageNumber      = opt.pageNumber || defaultOptions.pageNumber;
    var entriesPerPage  = opt.entriesPerPage || defaultOptions.entriesPerPage

    var params = {
      keywords: [opt.searchQuery],

      // add additional fields
      outputSelector: ['PictureURLLarge', 'PictureURLSuperSize'],

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
          'sandbox' : false
    };


    ebay.xmlRequest(options, function(err, res){
      if(err){
        return reject(err);
      }
      results = res.searchResult.item;
      var ads = results.map(item => {

      var picture = item.galleryURL;

      if(item.pictureURLSuperSize){
        picture = item.pictureURLSuperSize;
      }else if(item.pictureURLLarge) {
        picture = item.pictureURLLarge;
      }

        var loc = item.location.split(",");

        var adBody = {
          name: item.title,
          image: item.galleryURL,
          price: item.sellingStatus.currentPrice.amount,
          fromSite: "Ebay",
          city: loc[0],
          country: item.country,
          url:item.viewItemURL,
          currency:item.sellingStatus.currentPrice.currencyId,
          isAuction: false
        };

        var ad = new AdDb(adBody);

        ad.save();

        return ad._id;
      });

      SearchDB.findByIdAndUpdate(searchId, {$pushAll: {"ads":ads}},
        function(err, result){
        if(err){
          resolve(undefined);
        }else{
          resolve(true);
        }
      });
    });
  });
}
