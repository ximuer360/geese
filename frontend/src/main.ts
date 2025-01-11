import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import './style.css';

const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  messages: {
    zh: {
      latest: '最新',
      hot: '热门',
      loadMore: '加载更多',
      loading: '加载中...'
    },
    en: {
      latest: 'Latest',
      hot: 'Hot',
      loadMore: 'Load More',
      loading: 'Loading...'
    }
  }
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app'); 