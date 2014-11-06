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

angular.module('yhteiset.palvelut.tallennusMuistutus', [])
  .factory('tallennusMuistutus', ['$rootScope', 'i18n', function($rootScope, i18n) {
    var form = null;
    var kysyVarmistus = true;

    function varmista() {
      return form && form.$dirty && kysyVarmistus;
    }

    function confirmBeforeUnload(e) {
      if (varmista()) {
        var confirmationMessage = i18n['haluatko-poistua'];
        (e || window.event).returnValue = confirmationMessage;     //Gecko + IE
        return confirmationMessage;                                //Webkit, Safari, Chrome etc.

        // Toisin kuin Angularin $locationChangeStart-eventissä, täällä ei
        // tarvitse välittää varmistaPoistuminen-flagin myöhemmistä arvoista,
        // koska unloadin jälkeen kaikki skriptit ladataan uudestaan.
      }
    }

    window.addEventListener('beforeunload', confirmBeforeUnload, false);

    $rootScope.$on('$locationChangeStart', function (event) {
      if (varmista()) {
        if (window.confirm(i18n['haluatko-poistua'])) {
          kysyVarmistus = false;
        } else {
          event.preventDefault();
        }
      }
    });

    return {
      muistutaTallennuksestaPoistuttaessaFormilta: function(f) {
        form = f;
        kysyVarmistus = true;
      }
    };
  }])

;
