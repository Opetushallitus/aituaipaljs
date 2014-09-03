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

angular.module('yhteiset.direktiivit.hakuvalitsin', [] )
  .factory('modelPromise', ['$q', function ($q) {
    return function (model) {
      // Palauttaa promisen, joka sisältää annetun modelin. Jos model on Angular
      // resource, palauttaa sen oman promisen.
      return (model && model.$promise) || $q.when(model);
    }
  }])
  .directive('hakuValitsin', ['i18n', 'kieli', 'modelPromise', function (i18n, kieli, modelPromise) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        otsikko: '@',
        url: '@',
        model: '=',
        modelIdProperty: '@',
        modelTextProperty: '@',
        searchPropertyMap: '@',
        pakollinen: '='
      },

      template: '<fieldset class="select2-fieldset">' +
        '<label ng-class="{pakollinen : pakollinen}">{{otsikko}}</label>' +
        '<input ui-select2="options" ng-required="pakollinen" ng-model="selection" data-placeholder="Valitse"></input>' +
        '</fieldset>',

      controller: function ($scope) {
        var modelIdProp = $scope.modelIdProperty;
        var modelTextProp = $scope.modelTextProperty;
        var searchPropertyMap = $scope.$eval($scope.searchPropertyMap);

        // Select2 hävittää saamastaan model-oliosta kenttiä valinnan
        // vaihtuessa. Tämän vuoksi ei voida antaa Angular-scopessa olevaa
        // modelia suoraan Select2:lle, vaan annetaan sille eri olio, ja
        // pidetään watcheilla niiden id- ja text-kentät synkassa.

        $scope.$watch('selection', function (value) {
          if (value && value[modelIdProp]) {
            $scope.model = $scope.model || {};
            _.assign($scope.model, value);
          } else if (value === '') {
            //Kun tyhjennetään select2 inputti.
            delete $scope.model[modelIdProp];
          }
        });

        // Jostain syystä watch ei huomaa, kun Angular resourcen promise
        // valmistuu ja täyttää puuttuvat kentät modeliin. Kierretään ongelma
        // odottamalla promisea eksplisiittisesti. Direktiivin model voi olla
        // myös tavallinen olio, joten haetaan modelille promise
        // modelPromise-funktiolla (ks. yllä).
        $scope.$watch('model', function (value) {
          modelPromise(value).then(function () {
            if (value && value[modelIdProp]) {
              $scope.selection = $scope.selection ? $scope.selection : {};
              $scope.selection[modelIdProp] = value[modelIdProp];
              $scope.selection[modelTextProp] = lokalisoituTeksti(value, modelTextProp);
            }
          })
        });

        function lokalisoituTeksti(obj, textProp) {
          var teksti = '';

          if (_.has(obj, textProp)) {
            teksti = obj[textProp];
          } else {
            teksti = obj[textProp + '_' + kieli];
          }
          return teksti;
        }

        function mapSearchResult(obj) {
          if (searchPropertyMap) {
            return _.transform(searchPropertyMap, function (result, toKey, fromKey) {
              result[toKey] = obj[fromKey];
            });
          } else {
            return obj;
          }
        }

        $scope.options = {
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
              return {results: _.map(data, mapSearchResult)};
            }
          },
          formatResult: function (object) {
            return lokalisoituTeksti(object, modelTextProp);
          },
          formatSelection: function (object) {
            return lokalisoituTeksti(object, modelTextProp);
          },
          id: function (object) {
            return object[modelIdProp];
          },
          formatNoMatches: function () {
            return i18n.yleiset['ei_tuloksia'];
          },
          formatInputTooShort: function () {
            return i18n.yleiset['anna_hakuehto'];
          },
          formatSearching: function () {
            return i18n.yleiset['etsitaan'];
          },
          initSelection: function () {
          }
        };
      }
    };
  }])
;