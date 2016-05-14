
var request = '<?xml version="1.0" encoding="utf-8"?>' +
'<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
  '<soap:Header>' +
    '<AuthenticationHeader xmlns="http://api.tradera.com">' +
      '<AppId>[APPID]</AppId>' +
      '<AppKey>[APIKEY]</AppKey>' +
    '</AuthenticationHeader>' +
    '<ConfigurationHeader xmlns="http://api.tradera.com">' +
      '<MaxResultAge>10000</MaxResultAge>' +
    '</ConfigurationHeader>' +
  '</soap:Header>' +
  '<soap:Body>' +
    '<Search xmlns="http://api.tradera.com">' +
      '<query>[SEARCH]</query>' +
      '<categoryId>0</categoryId>' +
      '<pageNumber>[PAGENUMBER]</pageNumber>' +
      '<orderBy>[ORDERING]</orderBy>' +
    '</Search>' +
  '</soap:Body>' +
'</soap:Envelope>'

module.exports = function(appId, appKey, search, pageNumber, orderBy) {

  return request
  .replace("[APPID]", appId)
  .replace("[APIKEY]", appKey)
  .replace("[SEARCH]", search)
  .replace("[PAGENUMBER]", pageNumber)
  .replace("[ORDERING]", orderBy);
}
