/**
 * @author dengxingquan
 * @date 2023-04-25
 * @description 应用入口文件
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus, { size: 'default', zIndex: 3000 })

app.mount('#app') 