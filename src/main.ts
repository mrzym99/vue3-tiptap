import { createApp } from "vue";
import "./style.scss";
import "./reset.scss";
import App from "./App.vue";
import i18n from "./plugins/i18.ts";

const app = createApp(App);
app.use(i18n);
app.mount("#app");
