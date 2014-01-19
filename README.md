angular-google-endpoints
========================

This projects aims at providing a clean interface to [Google Endpoints][1] for your [AngularJS][2] application.

For generic details on how to use Google Enpoints from JavaScript, check the [official documentation][3]. To get an idea of what inspired me to do this, read the amazing article [AngularJS + Cloud Endpoints: A Recipe for Building Modern Web Applications][4].

[1]: https://developers.google.com/appengine/docs/python/endpoints/
[2]: http://angularjs.org/
[3]: https://developers.google.com/appengine/docs/python/endpoints/consume_js
[4]: https://cloud.google.com/developers/articles/angularjs-cloud-endpoints-recipe-for-building-modern-web-applications

## Step 1: Add Google API's JavaScript client library


```html
<script src="//apis.google.com/js/client.js"></script>
```

## Step 2: Map the Endpoints API to a resource

```js

angular.module('myApp.resources', [])
  .factory('MyResource', ['endpointsClient', function (endpointsClient) {
    return endpointsClient.Resource(
    'your_api_name', 'v1', 'https://your_app_id.appspot.com/_ah/api',
      {
        do_something: 'do_something',
        update: 'patch',
        remove: 'remove'
      }
  );
}]);

```

## Step 3: Use it!

```js

angular.module('myApp.controllers', [])
    .controller('HomeCtrl', ['$scope', 'MyResource',
        function ($scope, MyResource) {
            $scope.load_completed = false;

            MyResource.do_something({action_type: 'cool stuff'})
              .then(function (response) {
                $scope.result = response.action_result;
                $scope.load_completed = true;
              });
        }
    ])

```

## TODO
* Write tests.
* Test [authentication support with OAuth 2.0][todo1].

[todo1]: https://developers.google.com/appengine/docs/python/endpoints/consume_js#Python_Adding_authentication_support_with_OAuth_20
