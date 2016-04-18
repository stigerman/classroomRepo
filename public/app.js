angular.module('app', ['ui.router', 'angularFileUpload' ])
  .config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/register');
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/partials/home.html'           
        })
        .state('tdashboard', {
          url: '/teacherdashboard',
          templateUrl:"partials/teacherdashboard.html"
        })
         .state('pdashboard', {
          url: '/parentdashboard',
          templateUrl:"partials/parentdashboard.html"
        })
         .state('classroom', {
          url:'/classroom',
          templateUrl:"partials/classroom.html"
         })
         .state('classroom.gallery', {
          url:'/gallery',
          controller:'viewGalleryController',
          templateUrl:"partials/classroomgallery.html"
         })
         .state('classroom.feed', {
          url:'/feed',
          controller:'viewPostController',
          templateUrl:"partials/classroomfeed.html"
         })
         .state('messages', {
          url:'/messages',
          templateUrl:"partials/messages.html"
         })
         .state('messages.inbox', {
          url:'/inbox',
          controller:'inboxController',
          templateUrl:"partials/messagesinbox.html"
         })
         .state('messages.view', {
          url:'/viewmessage',
          controller:'emailController',
          templateUrl:"partials/viewmessage.html"
         })
         .state('messages.compose', {
          url:'/compose',
          controller:'createController',
          templateUrl:"partials/messagescompose.html"
         })
          .state('messages.twilio', {
          url:'/twilio',
          controller:'twiliocontroller',
          templateUrl:"partials/twilio.html"
         })
          .state('register', {
          url:'/register',
          templateUrl:"partials/register.html"
          })
          .state('post', {
          url:'/post',
          controller:'postController',
          templateUrl:"partials/post.html"
          })

     }
   ])

  .factory('InboxFactory', function InboxFactory ($http) {
   var exports = {};

   exports.getMessages = function () {
      return $http.get('json/emails.json')
         .error(function (data) {
          console.log('your request witht the following data was successful ' + data);
      });
   };

   exports.createPosts = function (){
   return $http.post('/post').success(function(data){
        console.log(data);
      });
   }

   return exports;
  })
     
  .controller('twiliocontroller', function($scope, $http){
    $scope.user = {};
    $scope.submitMessage = function() {
      $http.post("http://localhost:3000/testtwilio",{
        'to': $scope.user.to,
        'content': $scope.user.content
      }).success(function(success){
        console.log(success);
      })
    }
  })

  .controller('inboxController', function ($scope, InboxFactory) {
   // initialize the title property to an array for the view to use
     InboxFactory.getMessages()
      .success(function(jsonData, statusCode) {
         console.log('The request was successful!', statusCode, jsonData);
         // Now add the Email messages to the controller's scope
         $scope.emails = jsonData;
         $scope.sortColumn = name
    })
  })

  .controller('createController',function ($scope, $http) {
    $scope.submit = function() {
      $http.post('http://localhost:3000/feed', $scope.post).success(function(data){
        console.log(data);
      });
    };

})


  .controller('AppController', ['$scope', 'FileUploader', function($scope, FileUploader) {
        var uploader = $scope.uploader = new FileUploader({
            url: '/upload'
        });

        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }])

  .controller('viewPostController', function($scope, $http, $stateParams) {
    var loadPosts = function(){
      $http.get('http://localhost:3000/feed').success(function(posts, statusCode) {
        console.log('The request was successful!', statusCode, posts);
        $scope.posts = posts;
      });
    };
    loadPosts();

  })

  .controller('viewGalleryController', function($scope, $http, $stateParams) {
    var loadGallery = function(){
      $http.get('http://localhost:3000/upload').success(function(images, statusCode) {
        console.log('The request was successful!', statusCode, images);
        $scope.images = images;
      });
    };
    loadGallery();

  })

