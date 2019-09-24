var soap = require('soap');
var path = require('path');

function FedEx(args) {

  var $scope = this;

  $scope.hosts = {
    sandbox: 'https://wsbeta.fedex.com',
    live: 'https://ws.fedex.com'
  };
  
  var defaults = {
    currency: 'MXN',
    language: 'es-ES',
    environment: 'sandbox',
    key: '',
    password: '',
    account_number: '',
    meter_number: '',
    pretty: true,
    user_agent: 'Test'
  };

  $scope.config = function(args) {
    $scope.options = Object.assign(defaults, args);
    return $scope;
  };

  function generateAuthentication(data, resource, options) {
    var params = {
      WebAuthenticationDetail: {
        UserCredential: {
          Key:      $scope.options.key,
          Password: $scope.options.password
        }
      },
      ClientDetail: {
        AccountNumber:  $scope.options.account_number,
        MeterNumber:    $scope.options.meter_number
      }
    };

    if(resource && resource.version) {
      params['Version'] = {
        ServiceId:    resource.version.ServiceId,
        Major:        resource.version.Major,
        Intermediate: resource.version.Intermediate,
        Minor:        resource.version.Minor
      };
    }

    return Object.assign(params, data);
  }

  function buildTrackingRequest(data, options, resource) {

    return new Promise ((resolve, reject) => {
      
      let url = path.join(__dirname,  'wsdl', resource.wsdl);

      soap.createClient(url, (err, client) => {
        
        var xml = generateAuthentication(data, resource, options);
        console.log(xml)
        client.track(xml, function(err, result) {
      
          if(err) {
            return reject(err.root.Envelope.Body.Fault);
          }
    
          return resolve(result);
        });

      });

    });
    
  }

  var resources = {
    track: {f: buildTrackingRequest, wsdl: 'TrackService_v9.wsdl', path: '/web-services', version: {ServiceId: 'trck', Major: 9, Intermediate: 1, Minor: 0}},
  };

  function buildResourceFunction(i, resources) {
    return function(data, options) {
      return resources[i].f(data, options, resources[i]);
    }
  }

  for(var i in resources) {
    $scope[i] = buildResourceFunction(i, resources);
  }

  return $scope.config(args);
}

module.exports = FedEx;