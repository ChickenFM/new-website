<template>
  <v-alert prominent type="error" v-if="show">
    <v-row align="center">
      <v-col class="grow">Couldn't connect to the server!.</v-col>
      <v-col class="shrink">
        <v-btn @click="reload">Retry</v-btn>
      </v-col>
    </v-row>
  </v-alert>
</template>

<script>
export default {
  props: {
      show: Boolean,
      reload: Function
  }
};
</script>