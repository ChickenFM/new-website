<template>
  <v-app>
    <v-app-bar app color="primary" dark clipped-left>
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
      <v-spacer />
      <div class="text-center">
        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              {{
              $t(`languages.${$i18n.locale}`)
              }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, index) in $i18n.availableLocales"
              :key="index"
              @click="$i18n.locale = item"
            >
              <v-list-item-title>
                {{
                $t(`languages.${item}`)
                }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>
    <v-navigation-drawer
      :mobile-breakpoint="600"
      app
      :expand-on-hover="$vuetify.breakpoint.smAndUp"
      :mini-variant="$vuetify.breakpoint.smAndUp"
      clipped
      v-model="drawer"
    >
      <v-list nav dense shaped>

        <v-tooltip bottom v-if="showDJStatus">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item link class="px-0" v-bind="attrs" v-on="on">
              <v-list-item-avatar>
                <v-icon>mdi-microphone</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ nowplaying.presenter }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>DJ</span>
        </v-tooltip>

        <v-tooltip bottom v-if="showPlayingStatus">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item link class="px-0" v-bind="attrs" v-on="on">
              <v-list-item-avatar>
                <v-img v-if="$route.name == 'Home'" :src="nowplaying.next.cover_medium" />
                <v-img v-if="$route.name != 'Home'" :src="nowplaying.cover_medium" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ ($route.name == 'Home') ? nowplaying.next.title : nowplaying.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ ($route.name == 'Home') ? nowplaying.next.artist : nowplaying.artist }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>{{ ($route.name == 'Home') ? $t("playing next") : $t("nowplaying") }}</span>
        </v-tooltip>

        <v-divider></v-divider>

        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item tag="router-link" to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t("nav.home") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/songrequest">
            <v-list-item-icon>
              <v-icon>mdi-music-box-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{
                $t("nav.song requests")
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/lyrics">
            <v-list-item-icon>
              <v-icon>mdi-music-note</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ $t("nav.lyrics") }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item tag="router-link" to="/sendmessage">
            <v-list-item-icon>
              <v-icon>mdi-android-messages</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{
                $t("nav.send a message")
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-group prepend-icon="mdi-link" link :value="false" no-action>
            <template v-slot:activator>
              <v-list-item-title>{{ $t("nav.links") }}</v-list-item-title>
            </template>

            <v-list-group no-action sub-group :value="false">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>Discord</v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item link href="https://l.chickenfm.com/discord" target="_blank">
                <v-list-item-title>Discord server</v-list-item-title>
              </v-list-item>
              <v-list-item link href="http://l.chickenfm.com/bot" target="_blank">
                <v-list-item-title>Discord bot</v-list-item-title>
              </v-list-item>
            </v-list-group>
            <v-list-group no-action sub-group :value="false">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title>
                    {{
                    $t("nav.where to listen")
                    }}
                  </v-list-item-title>
                </v-list-item-content>
              </template>

              <v-list-item link href="https://l.chickenfm.com/onlineradiobox" target="_blank">
                <v-list-item-title>OnlineRadioBox</v-list-item-title>
              </v-list-item>
              <v-list-item
                link
                href="https://www.radionomy.com/en/radio/chickenfm/index"
                target="_blank"
              >
                <v-list-item-title>Radionomy</v-list-item-title>
              </v-list-item>
            </v-list-group>
          </v-list-group>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <audio ref="audio" :title="loading ? '' : nowplaying.text"></audio>
      <router-view
        :nowplaying="nowplaying"
        :station="station"
        :loading="loading"
        :cover="cover"
        :listen_url="listen_url"
        :reload="reload"
      />
    </v-main>
  </v-app>
</template>

<script>
import { get } from "axios";

export default {
  name: "App",
  data: () => ({
    loading: true,
    nowplaying: {},
    cover: "",
    listen_url: "",
    drawer: false,
    group: null,
    togglingDrawer: false,
    station: localStorage.getItem("station")
      ? parseInt(localStorage.getItem("station"))
      : 1
  }),
  watch: {
    station(v) {
      localStorage.setItem("station", v);
      this.reload();
    },
    "$i18n.locale"(v) {
      localStorage.setItem("locale", v);
    }
  },
  computed: {
    showPlayingStatus() {
      if(this.$route.name == 'Home' && this.nowplaying.presenter == "AutoDJ")
        return true
      else if(this.$route.name != "Home") 
        return true
      else
        return false
    },
    showDJStatus() {
      if(this.nowplaying.presenter != "AutoDJ")
        return true
      else return false
    }
  },
  methods: {
    load() {
      get(`https://api.chickenfm.com/nowplaying/${this.station}`)
        .then(res => {
          this.errored = false;
          this.listen_url = res.data.listen_url;
          if (this.nowplaying.text !== res.data.text) {
            this.cover = res.data.cover_xl;
          }
          this.nowplaying = res.data;
          if ("mediaSession" in navigator) {
            /* eslint-disable-next-line */
            navigator.mediaSession.metadata = new MediaMetadata({
              title: res.data.title,
              artist: res.data.artist,
              album: res.data.station,
              artwork: [
                {
                  src: res.data.cover_medium,
                  sizes: "250x250",
                  type: "image/jpg"
                },
                {
                  src: res.data.cover_xl,
                  sizes: "1000x1000",
                  type: "image/jpg"
                }
              ]
            });
            navigator.mediaSession.setActionHandler("play", () => {
              this.playStream();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
              this.pauseStream(false);
            });
            navigator.mediaSession.setActionHandler("stop", () => {
              this.pauseStream(true);
            });
          }
        })
        .catch(() => (this.errored = true))
        .finally(() => (this.loading = false));
    },
    reload() {
      this.errored = false;
      this.loading = true;
      this.load();
    }
  },
  mounted() {
    if (navigator.language) {
      const userLang = navigator.language.split("-")[0];
      if (this.$i18n.availableLocales.includes(userLang)) {
        this.$i18n.locale = userLang;
      }
    }
    this.drawer = this.$vuetify.breakpoint.smAndUp;
    if (!localStorage.getItem("station")) {
      localStorage.setItem("station", 1);
    }
    if (localStorage.getItem("locale")) {
      this.$i18n.locale = localStorage.getItem("locale");
    }
    this.load();
    setInterval(this.load, 5000);
  }
};
</script>
<style scoped>
.rounded-image {
  border-radius: 10px;
}
</style>
