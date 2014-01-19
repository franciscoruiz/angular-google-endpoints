'use strict';


angular.module('endpoints.client', []).factory('endpointsClient', [
'$rootScope', '$q', '$log',
function ($scope, $q, $log) {
  var EndpointsClient = function () {
    var self = this;

    var load_client = function (api_id, api_version, api_url) {
      var deferred = $q.defer();
      self.loader.then(function (loader) {
        loader.load(
          api_id,
          api_version,
          function () {
            deferred.resolve(loader[api_id]);
            $log.log(
              'API client for ' +
              api_id +
              ' (version ' + api_version + ') ' +
              'is ready'
            );
          },
          api_url
        );
      });
      return deferred.promise;
    };

    self.Resource = function (api_id, api_version, api_url, methods) {
      var endpoints_client = load_client(api_id, api_version, api_url);
      var resource = {};
      angular.forEach(methods, function (remote_name, local_name) {
        resource[local_name] = self.get_method(endpoints_client, remote_name);
      });
      return resource;
    };

    self.get_method = function (endpoints_client, method_name) {
      var method_name_parts = method_name.split('.');
      var method = function () {
        var deferred = $q.defer();

        var method_arguments = arguments;
        endpoints_client.then(function (client) {
          var endpoint = client;
          angular.forEach(method_name_parts, function (method_name_part) {
            endpoint = endpoint[method_name_part];
            if (angular.isUndefined(endpoint)) {
              $log.error('Method "' + method_name + '" not found');
            }
          });
          endpoint.apply({}, method_arguments).execute(function (response) {
            $scope.$apply(function () {
              if (response.error) {
                deferred.reject(response);
              } else {
                deferred.resolve(response);
              }
            });
          });
        });
        return deferred.promise;
      };
      return method;
    };

    var init = function () {
      var deferred = $q.defer();
      gapi.load('client', function () {
        deferred.resolve(gapi.client);
      });
      self.loader = deferred.promise;
    };

    init();
  };

  return new EndpointsClient();
}]);
