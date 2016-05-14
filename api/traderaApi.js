var parseString = require('xml2js').parseString;
var fs = require('fs');
var request = require('request')
var config = require("../config")

var traderaRequest = require('./traderaSearchRequest')
var AdModel = requure('../dbmodels/admodel')

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

    parseString(data, (err, parsed) => {
        if(err) {
          callback(err, null);
        } else {
          var result = parsed['soap:Envelope']['soap:Body'][0].SearchResponse[0].SearchResult[0].Items;

          callback(null, result);  
        }
        
    });
}

function search(query, pageNumber, orderBy, callback) {
  if(!orderBy) {
    orderBy = "Relevance";
  }
  if(!pageNumber) {
    pageNumber = 1;
  }

  var body = traderaRequest(config.traderaAppId, config.traderaAppKey, query, pageNumber, orderBy);

  traderaRequest(body, (err, result) => {
    if(err) {
      callback(err, null);
      return;
    }


  })

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

search("iphone", null, null, (err, result) => {
  console.log(err, result);
});

/*fs.readFile('../tradera.xml', 'utf-8',(err, data) => {
  if(err) {
      console.log(err);
  }
  data = htmlSpecialCharacters(data);
  parseString(data, (err, parsed) => {
      console.log(parsed['soap:Envelope']['soap:Body'][0].SearchResponse[0].SearchResult);

  });

});*/

