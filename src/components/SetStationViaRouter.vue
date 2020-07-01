<template>
  <div>
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          {{ $t("loadingtext") }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { get } from "axios";

export default {
  data() {
    return {
    dialog: true,
      station: null
    };
  },
  created() {
    get("https://radio.chickenfm.com/api/stations").then(({ data }) => {
      this.station = data.find(s => s.id == this.$route.params.id);
      if (!this.station)
        this.station = data.find(
          station => station.shortcode == this.$route.id
        );
      if (this.station) this.$parent.$parent.$parent.station = this.station.id;

      this.$router.push({ name: "Home" });
    });
  }
};
</script>