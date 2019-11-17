<template>
  <div id="app">
    <h1>Oslo Bysykkel</h1>
    <div class="app-status" v-html="status">
    </div>
    <ul class="stations">
      <station v-for="station in stations"
               v-bind:station="station"
               v-bind:key="station.station_id">
      </station>
    </ul>
  </div>
</template>

<script>
 import Station from './components/Station.vue';
 import Vue from 'vue';

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

 export default {
     name: 'app',
     data () {
         return {
             status: 'Henter stasjoner …',
             stations: {},
         }
     },
     components: {
         Station,
     },
     methods: {
         /**
          * Display the text `status` to the user.
          */
         setStatus (status) {
             this.status = status;
         },

         /**
          * Fetch the station list from the API and populate the local list.
          */
         initStations () {
             return fetch(stationURL).then(res => {
                 res.json().then(json => {
                     json.data.stations.forEach(station => {
                         station.status = {};
                         Vue.set(this.stations, station.station_id, station);
                     });
                 });
             });
         },

         /**
          * Fetch the latest station status from the API and update the local list.
          */
         refreshStatus () {
             return fetch(statusURL).then(res => {
                 res.json().then(json => {
                     json.data.stations.forEach(station => {
                         Vue.set(this.stations[station.station_id], 'status', station);
                     });

                     const time = new Date().toLocaleTimeString('nb');
                     this.setStatus(`Sist oppdatert <span class="pulse">${time}<span>`);
                 });
             }).catch(() => {
                 this.setStatus('Feil ved sjekking av tilgjengelighet.');
             });
         },
     },
     created () {
         this.initStations().then(() => {
             this.setStatus('Sjekker tilgjengelighet …');
             this.refreshStatus();
             window.setInterval(this.refreshStatus, refreshInterval);
         }).catch(() => {
             this.setStatus('Feil ved henting av stasjoner.');
         });
     }
 };
</script>

<style>
 #app {
     text-align: center;
     font-family: sans-serif;
 }

 .app-status {
     margin: 2rem;
     color: #666;
 }

 @keyframes pulse {
     from {
         border-bottom: 4px solid #00afff;
     }

     to {
         border-bottom: 4px solid #fff;
     }
 }

 .pulse {
     animation: pulse 2s ease;
 }

 .stations {
     display: block;
     margin: 0 auto;
     padding: 0;
     list-style: none;
     max-width: 320px;
 }

 .station {
     margin-bottom: 1rem;
     padding: 1.5rem;
     border: 1px solid #ccc;
     border-radius: 5px;
     text-align: center;
     font-size: 32px;
 }
</style>
