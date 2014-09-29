// Copyright (c) 2014 The Finnish National Board of Education - Opetushallitus
//
// This program is free software:  Licensed under the EUPL, Version 1.1 or - as
// soon as they will be approved by the European Commission - subsequent versions
// of the EUPL (the "Licence");
//
// You may not use this work except in compliance with the Licence.
// You may obtain a copy of the Licence at: http://www.osor.eu/eupl/
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// European Union Public Licence for more details.

angular.module('yhteiset.palvelut.palvelinvirhe', [])
  .factory('httpInternalErrorInterceptor', ['$q', '$location', function($q, $location) {
    return {
      'responseError': function(rejection) {
        if (rejection.status === 500) {
          $location.path("/palvelinvirhe");
        }
        return $q.reject(rejection);
      }
    };
  }])

  .config(['$httpProvider', '$routeProvider', function($httpProvider, $routeProvider) {
    $httpProvider.interceptors.push('httpInternalErrorInterceptor');

    $routeProvider.when('/palvelinvirhe', {
      template: '<h1>{{ i18n.palvelinvirhe.otsikko }}</h1><div>{{ i18n.palvelinvirhe.teksti }}</div>',
      controller: ['$scope', 'i18n', function($scope, i18n) {
        $scope.i18n = i18n;
      }]
    });
  }])
;
