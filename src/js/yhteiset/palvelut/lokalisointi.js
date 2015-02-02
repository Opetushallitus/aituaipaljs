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
    return function(obj, prop) {
      if (!obj) {
        return '';
      }
      var haluttu = obj[prop + '_' + kieli];
      if (haluttu) {
        return haluttu;
      }
      var toinenKieli = (kieli === 'fi') ? 'sv' : 'fi';
      var haluttuToinen = obj[prop + '_' + toinenKieli];
      if (haluttuToinen) {
        return haluttuToinen;
      }
      return obj[prop];
    };
  }])
  .filter('orderByLokalisoitu', ['$filter', function($filter) {
    return function(entityt, kentta, reverse){
      return $filter('orderBy')(entityt, function(entity) {
        return $filter('lokalisoiKentta')(entity, kentta);
      }, reverse)
    };
  }]);

