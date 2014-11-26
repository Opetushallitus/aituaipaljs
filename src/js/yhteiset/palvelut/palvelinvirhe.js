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

'use strict';

angular.module('yhteiset.palvelut.palvelinvirhe', [])
  .factory('httpInternalErrorInterceptor', ['$q', 'ilmoitus', function($q, ilmoitus) {
    // cdep workaround
    var injector = angular.injector(['yhteiset.palvelut.i18n']);
    var i18n = injector.get('i18n');

    return {
      'responseError': function(rejection) {
        if (rejection.status === 500) {
          ilmoitus.virhe(i18n.hae('yleiset.palvelin_virhe'));
        }
        return $q.reject(rejection);
      }
    };
  }])

  .config(['$httpProvider', '$routeProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpInternalErrorInterceptor');
  }])
;
