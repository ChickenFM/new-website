<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="d-flex align-center">
        <v-img
          alt="ChickenFM Logo"
          class="shrink mr-2 rounded-image"
          contain
          src="./assets/images/cover.png"
          transition="scale-transition"
          width="100"
        />
      </div>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :clipped="true" app>
      <v-list nav dense>
        <v-list-item>
          <v-list-item-content>
            <v-img src="@/assets/images/cover.png" class="rounded-image" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item tag="router-link" to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/songrequest">
            <v-list-item-icon>
              <v-icon>mdi-music-box-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Song Requests</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/lyrics">
            <v-list-item-icon>
              <v-icon>mdi-music-note</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Lyrics</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/sendmessage">
            <v-list-item-icon>
              <v-icon>mdi-android-messages</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Send a message</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <audio ref="audio"></audio>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    drawer: false,
    group: null,
    station: 1
  }),
  watch: {
    group() {
      this.drawer = false;
    }
  }
};
</script>
<style scoped>
.rounded-image {
  border-radius: 10px;
}
</style>
