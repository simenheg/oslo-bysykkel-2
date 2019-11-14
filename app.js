(function (Vue) {
  /**
   * API URL base.
   */
  const baseURL = 'https://gbfs.urbansharing.com/oslobysykkel.no';

  /**
   * API URL for retrieving stations.
   */
  const stationURL = `${baseURL}/station_information.json`;

  /**
   * API URL for retrieving station statuses.
   */
  const statusURL = `${baseURL}/station_status.json`;

  /**
   * Number of milliseconds to wait between status updates.
   */
  const refreshInterval = 10 * 1000;

  /**
   * Display the text `status` to the user.
   */
  function setStatus (status) {
    app.status = status;
  }

  /**
   * Fetch the station list from the API and populate the local list.
   */
  function initStations () {
    return fetch(stationURL).then(res => {
      res.json().then(json => {
        json.data.stations.forEach(station => {
          station.status = {};
          Vue.set(app.stations, station.station_id, station);
        });
      });
    }).catch(() => {
      setStatus('Feil ved henting av stasjoner.');
    });
  }

  /**
   * Fetch the latest station status from the API and update the local list.
   */
  function refreshStatus () {
    return fetch(statusURL).then(res => {
      res.json().then(json => {
        json.data.stations.forEach(station => {
          Vue.set(app.stations[station.station_id], 'status', station);
        });

        const time = new Date().toLocaleTimeString('nb');
        setStatus(`Sist oppdatert <span class="pulse">${time}<span>`);
      });
    }).catch(() => {
      setStatus('Feil ved sjekking av tilgjengelighet.');
    });
  }

  const app = new Vue({
    el: '#app',
    data: {
      status: 'Henter stasjoner …',
      stations: {},
    },
    components: {
      station: {
        props: ['station'],
        template: `<li class="station">
                     <h2>{{ station.name }}</h2>
                     <div class="status">
                       <span>🚲 {{ station.status.num_bikes_available }}</span>
                       <span>🔒 {{ station.status.num_docks_available }}</span>
                     </div>
                   </li>`,
      },
    },
  });

  initStations().then(() => {
    setStatus('Sjekker tilgjengelighet …');
    refreshStatus();
    window.setInterval(refreshStatus, refreshInterval);
  });
})(window.Vue);
