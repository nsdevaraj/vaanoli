app.factory('radioService', function($cookies) {
  var fac = {};
  var catArray =[];
  var categories =[];
  var radioCategories = []
  fac.url = 'http://164.132.63.75:9998/',
  fac.name = "Chennai FM Rainbow",
  fac.index = 1;
  fac.allStations = function() {
    return stations
  };
  stations.forEach(function categorize(st){
  	if(catArray[st.category] == undefined) {
  		catArray[st.category]= []; 
  		categories.push(st.category);
  	}
  	catArray[st.category].push(st);
  })
  for (var i=0; i<categories.length; i++){
  	var category ={}
  	category.title = categories[i]; 
  	category.stations = catArray[ categories[i]];
  	radioCategories.push(category);
  } 
  fac.allCategories = radioCategories;
  var fav = {};
  if ($cookies.get('fav') === undefined) {
    $cookies.put('fav', '[{ "name": "Ilayaraja FM ", "url": "http://108.166.161.221:7154/", "image": "http://static.radio.net/images/broadcasts/16/88/19859/c175.png", "category": "Fans" }]');
  } 
  
  fac.favourite = function() {
    return {
      get: function() {
        var temp = $cookies.get('fav');
        fav.list = JSON.parse(temp);
        return fav.list;
      },
      add: function(obj) {
        fav.list.push(obj);
        $cookies.put('fav', JSON.stringify(fav.list));
        fac.favourite().get();
      },
      delete: function(id) {
        fav.list.splice(id, 1);
        $cookies.put('fav', JSON.stringify(fav.list));
        fac.favourite().get();
      }
    }
  };
  fac.playRadio = function() {
    $("#jquery_jplayer_1").jPlayer("setMedia", {
      mp3: fac.url + ";stream/1"
    }).jPlayer("play");
  }
  return fac;
})

app.controller('RadioHeadCtrl', function($rootScope, $scope, radioService) {
  $rootScope.station = radioService.name;
})

app.controller('RadioCtrl', function($rootScope, $scope, radioService) {
  var url = radioService.url;
  $scope.items = radioService.allStations();
  $scope.movebackward = function() {
    if ($scope.items[radioService.index - 1] !== undefined) {
      radioService.url = $scope.items[radioService.index - 1].url;
      radioService.index = $scope.items.indexOf($scope.items[radioService.index - 1]);
      radioService.name = $scope.items[radioService.index - 1].name;
      $rootScope.station = $scope.items[radioService.index - 1].name;
      radioService.playRadio();
    } else {
      return;
    }
  }
  $scope.moveforward = function() {
    if ($scope.items[radioService.index + 1] !== undefined) {
      radioService.url = $scope.items[radioService.index + 1].url;
      radioService.index = $scope.items.indexOf($scope.items[radioService.index + 1]);
      radioService.name = $scope.items[radioService.index + 1].name;
      $rootScope.station = $scope.items[radioService.index + 1].name;
      radioService.playRadio();
    } else {
      return;
    }
  }
  $("#jquery_jplayer_1").jPlayer({
    ready: radioService.playRadio,
    play: function(event) {
      console.log('play')
    },
    error: function(event) {
      radioService.name = "Station Not available";
      $rootScope.station = "Station Not available";
    }
  });
})

app.controller('HomeCtrl', function($rootScope, $scope, radioService) {
  $scope.items = radioService.allStations();
  $scope.changeChannel = function(radioChannel) {
    console.log(radioChannel);
    var index = $scope.items.indexOf(radioChannel);
    $rootScope.station = radioChannel.name;
    radioService.index = index;
    radioService.url = radioChannel.url;
    radioService.name = radioChannel.name;
    radioService.playRadio();
  }
  $scope.addFavourite = function(item) {
    delete item.$$hashKey;
    radioService.favourite().add(item);
  }
})

app.controller('FavCtrl', function($scope, radioService) {
  $scope.items = radioService.favourite().get();
  $scope.changeChannel = function(radioChannel) {
    var index = $scope.items.indexOf(radioChannel);
    radioService.index = index;
    radioService.url = radioChannel.url;
    radioService.name = radioChannel.name;
    radioService.playRadio();
  }
  $scope.deleteFavourite = function(item) {
    radioService.favourite().delete(item);
    $scope.items = radioService.favourite().get();
  }
}) 

app.controller('MyCtrl', function($scope, radioService) { 
	
  $scope.items = radioService.allCategories;
  $scope.toggleItem = function(item) {
    if ($scope.isItemShown(item)) {
      $scope.shownItem = null;
    } else {
      $scope.shownItem = item;
    }
  };
  $scope.isItemShown = function(item) {
    return $scope.shownItem === item;
  };
});