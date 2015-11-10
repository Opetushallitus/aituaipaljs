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

angular.module('yhteiset.palvelut.lokalisointi', [] )
  .filter('lokalisoiKentta', ['kieli', function(kieli){
    var prioriteettiJarjestys = [kieli, 'fi', 'sv', 'en'];

    return function(obj, prop) {
      if (!obj) {
        return '';
      }

      var tulos = obj[prop];

      _.forEach(prioriteettiJarjestys, function(k) {
        var arvo = obj[prop + '_' + k];
        if (arvo) {
          tulos = arvo;
          return false;
        }
      });
      return tulos;
    };
  }])
  .filter('orderByLokalisoitu', ['$filter', function($filter) {
    return function(entityt, kentta, reverse){
      var kenttaOsat = kentta.split('.');
      var polku = _.initial(kenttaOsat);
      var viimeinenKentta = _.last(kenttaOsat);
      return $filter('orderBy')(entityt, function(entity) {
        entity = _.reduce(polku, function(e, k) { return e[k]; }, entity);
        return $filter('lokalisoiKentta')(entity, viimeinenKentta);
      }, reverse);
    };
  }]);

