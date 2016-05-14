var parseString = require('xml2js').parseString;
var fs = require('fs');
var request = require('request');
var config = require("../config");
var util = require('util');

var traderaRequestBody = require('./traderaSearchRequest');
var AdModel = require('../dbmodels/admodel');

var exports = module.exports;

var post_options = {
      host: 'http://api.tradera.com',
      port: '80',
      path: '/v3/SearchService.asmx',
      method: 'POST',
      headers: {
          'Content-Type': 'text/xml'
      }
  };

var options = {
  url: 'http://api.tradera.com/v3/SearchService.asmx',
  headers: {
    'Content-Type': 'text/xml'
  },
  method: 'POST'
};

function htmlSpecialCharacters(text) {
  return text
  .replace('&', '&amp;');
}

function parseResult(response, callback) {
    var data = htmlSpecialCharacters(response);
    console.log('Parse: ' + data);
    parseString(data, (err, parsed) => {
        if(err) {
          callback(err, null);
        } else {
          var result = parsed['soap:Envelope']['soap:Body'][0].SearchResponse[0].SearchResult[0].Items;

          callback(null, result);
        }

    });
}

exports.search = function(query, searchOptions) {

  console.log("search");

  searchOptions = searchOptions || {};

  return new Promise((resolve, reject) => {


    searchOptions.pageNumber = searchOptions.pageNumber || 1;
    searchOptions.orderBy = searchOptions.orderBy || "Relevance";

    var body = traderaRequestBody(config.traderaAppId,
      config.traderaAppKey,
      query,
      searchOptions.pageNumber,
      searchOptions.orderBy);

    traderaRequest(body, (err, result) => {

      if(err) {

        reject(err);
        return;
      }

      //fs.writeFileSync('./data.json', util.inspect(result) , 'utf-8');

      var ads = result.map(item => {

        var isAuction = item.ItemType[0].indexOf("Auction") > -1
        var buyItNowPrice = item.ItemType[0] !== "Auction";

        console.log(item);
        var adBody = {
          name : item.ShortDescription[0],
          image: item.ThumbnailLink[0],
          price: buyItNowPrice ? item.BuyItNowPrice[0] : item.NextBid[0],
          fromSite: "tradera",
          url:"http://www.tradera.com/item/" + item.Id[0],
          currency:"SEK",
          isAuction: isAuction

        }

        var ad = new AdModel(adBody);

        ad.save();

        return ad;

      });

      resolve(ads);

    });

  });
}

function traderaRequest(body, callback) {

  options.body = body;

  request.post(options, (error, response, body) => {

    if(error || response.statusCode != 200) {
      callback(error, null);
    }

    result = parseResult(body, (err, result ) => {
      if (err) {
        callback(err, null)
      } else {
        callback(null, result);
      }
    });
  });
}
