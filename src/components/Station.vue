<template>
  <li class="station">
    <h2>{{ station.name }}</h2>
    <div class="status">
      <span>🚲 {{ station.status.num_bikes_available }}</span>
      <span>🔒 {{ station.status.num_docks_available }}</span>
    </div>
  </li>
</template>

<script>
 export default {
     name: 'Station',
     props: {
         station: Object,
     },
 };
</script>

<style scoped>
 h2 {
     margin: 0 0 1.5rem;
     font-size: 20px;
     font-weight: normal;
 }

 .status {
     display: flex;
 }

 .status span {
     flex: 1 0 50%;
 }
</style>
