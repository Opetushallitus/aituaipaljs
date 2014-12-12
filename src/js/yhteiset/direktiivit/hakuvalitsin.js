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

angular.module('yhteiset.direktiivit.hakuvalitsin', [] )
  .directive('hakuValitsin', ['i18n', 'kieli', function (i18n, kieli) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        otsikko: '@',
        url: '@',
        model: '=',
        modelIdProperty: '@',
        modelTextProperty: '@',
        pakollinen: '=',
        monivalinta: '='
      },

      template: '<fieldset class="select2-fieldset">' +
        '<label ng-class="{pakollinen : pakollinen}">{{otsikko}}</label>' +
        '<div ui-select2="options" ng-required="pakollinen" ng-model="model"></div>' +
        '</fieldset>',

      controller: function ($scope) {
        var modelIdProp = $scope.modelIdProperty;
        var modelTextProp = $scope.modelTextProperty;

        function lokalisoituTeksti(obj) {
          var teksti = '';

          if (_.has(obj, modelTextProp)) {
            teksti = obj[modelTextProp];
          } else {
            teksti = obj[modelTextProp + '_' + kieli];
          }
          return teksti;
        }

        $scope.options = {
          multiple: $scope.monivalinta,
          width: '100%',
          minimumInputLength: 1,
          allowClear: true,
          ajax: {
            url: $scope.url,
            dataType: 'json',
            quietMillis: 500,
            data: function (term) {
              return {
                termi: term // search term
              };
            },
            results: function (data) {
              return {results: data};
            }
          },
          formatResult: lokalisoituTeksti,
          formatSelection: lokalisoituTeksti,
          id: function (object) {
            return object[modelIdProp];
          },
          formatNoMatches: function () {
            return i18n.yleiset.ei_tuloksia;
          },
          formatInputTooShort: function () {
            return i18n.yleiset.anna_hakuehto;
          },
          formatSearching: function () {
            return i18n.yleiset.etsitaan;
          },
          initSelection: function () {
          }
        };
      }
    };
  }])
;
