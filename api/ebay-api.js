var ebay = require('ebay-api');
var appId = "FransHol-Selleri-SBX-8d32f3572-74249cb1";

  /*
   *
   */
function searchEbay(query, catId = 0, page = 1, entriesPerPage = 10){

  var params = {
    keywords: ["Canon Powershot"],

    // add additional fields
    outputSelector: ['AspectHistogram'],

    paginationInput: {
      entriesPerPage: entriesPerPage
    },

    itemFilter: [
      {name: 'FreeShippingOnly', value: true},
      {name: 'MaxPrice', value: '150'}
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
        console.log(res.searchResult.item);
  });
}


searchEbay("hej");