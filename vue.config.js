module.exports = {
  transpileDependencies: ["vuetify"],

  pwa: {
    name: "ChickenFM",
    themeColor: "#003AFF",
    workboxOptions: {
      exclude: [/_redirects/]
    },
    manifestOptions: {
      start_url: "/"
    }
  },

  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  }
};
