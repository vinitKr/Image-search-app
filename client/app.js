var app = angular.module("myApp", ["ngRoute"]);
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "templates/search-image.html",
        controller : "searchCtrl"
    })
    .when("/history", {
        templateUrl : "templates/search-history.html",
        controller : "searchCtrl"
    })
    .when("/results/:key", {
        templateUrl : "templates/results.html",
        controller : "searchCtrl"
    })
    .otherwise({
        template : "<h1>None</h1><p>Nothing has been selected</p>"
    });
    $locationProvider.html5Mode(true);
});
app.controller("searchCtrl", function ($scope, $http, $location) {
    var baseUrl = 'http://localhost:3000';
    $scope.searchKey = '';
    $scope.searchResult = {};
    $scope.history = [];
    $scope.prevResult = [];
    $scope.isProcessing=false;

    // search image on submit
    $scope.onSubmit= function(){
        $scope.isProcessing=true;
        
        $http.get(baseUrl + '/api/search/'+ $scope.searchKey)
        .then(function(response){
            $scope.isProcessing=false;
            console.log('response >>>>> ', response.data);
            $scope.searchResult = response.data.result;
        },
        function(err){
            $scope.isProcessing=false;
            console.log('err >>>>> ', err);
        })
    }

    // get search history
    $scope.getSearchHistory= function(){
        $scope.isProcessing=true;

        $http.get(baseUrl + '/api/search/keys')
        .then(function(response){
            $scope.isProcessing=false;
            console.log('response >>>>> ', response.data);
            $scope.history = response.data.result;
        },
        function(err){
            $scope.isProcessing=false;
            console.log('err >>>>> ', err);
        })
    }

    // get previous search result
    $scope.getSearchResult = function(){
        var url = $location.path().split('/');
        $scope.isProcessing=true;

        $http.get(baseUrl + '/api/search/result/'+ url[2])
        .then(function(response){
            $scope.isProcessing=false;
            console.log('response >>>>> ', response.data);
            $scope.prevResult = response.data.result;
        },
        function(err){
            $scope.isProcessing=false;
            console.log('err >>>>> ', err);
        })
    }
});