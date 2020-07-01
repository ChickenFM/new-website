import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import SongRequest from "../views/SongRequest";
import SetStationViaRouter from "../components/SetStationViaRouter"

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/songrequest",
        name: "Song Request",
        component: SongRequest
    },
    {
        path: "/lyrics",
        name: "Lyrics",
        component: () =>
            import ("../views/Lyrics.vue")
    },
    {
        path: "/sendmessage",
        name: "Send a message",
        component: () =>
            import ("../views/SendAMessage.vue")
    },
    {
        path: "/station/:id",
        name: "Set Station Via Router",
        component: SetStationViaRouter
    }
    // {
    //     path: "/about",
    //     name: "About",
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () =>
    //         import ( /* webpackChunkName: "about" */ "../views/About.vue")
    // }
];

const router = new VueRouter({
    routes,
    mode: "history"
});

export default router;