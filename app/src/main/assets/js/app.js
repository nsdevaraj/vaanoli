var app = angular.module('tamilFm', ['ionic', 'ngCookies'])

app.config(function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {});
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/home',
    views: {
      homeTab: {
        templateUrl: 'home.html'
      }
    }
  });
  $stateProvider.state('settings', {
    url: '/settings',
    views: {
      settingsTab: {
        templateUrl: 'settings.html'
      }
    }
  });
  $stateProvider.state('favourite', {
    url: '/favourite',
    views: {
      favouriteTab: {
        templateUrl: 'favourite.html'
      }
    }
  });
  $urlRouterProvider.otherwise('/home');
})