var ebay = require('ebay-api');
var appId = "FransHol-Selleri-SBX-8d32f3572-74249cb1";

  /*
   *
   */
function searchEbay(query, minPrice = 0, maxPrice = 1000, locatedIn = 'US', pageNumber = 1, entriesPerPage = 50){

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
        //console.log(res.searchResult.item);
        results = res.searchResult.item;
        for(result in results){
          console.log(results[result]);
        }
  });
}


function normaliseResult(items){

}

searchEbay("iPhone");