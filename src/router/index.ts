/**
 * @author dengxingquan
 * @date 2023-04-25
 * @description 路由配置文件
 */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '工具箱首页',
      keepAlive: true
    }
  },
  {
    path: '/tools',
    name: 'Tools',
    component: () => import('@/views/layout/ToolboxLayout.vue'),
    redirect: '/tools/text',
    meta: {
      title: '工具分类',
      keepAlive: true
    },
    children: [
      {
        path: 'text',
        name: 'TextTools',
        component: () => import('@/views/tools/TextTools.vue'),
        meta: {
          title: '文本工具',
          icon: 'document'
        }
      },
      {
        path: 'image',
        name: 'ImageTools',
        component: () => import('@/views/tools/ImageTools.vue'),
        meta: {
          title: '图片工具',
          icon: 'picture'
        }
      },
      {
        path: 'converter',
        name: 'ConverterTools',
        component: () => import('@/views/tools/ConverterTools.vue'),
        meta: {
          title: '格式转换',
          icon: 'refresh-right'
        }
      },
      {
        path: 'calculator',
        name: 'CalculatorTools',
        component: () => import('@/views/tools/CalculatorTools.vue'),
        meta: {
          title: '计算工具',
          icon: 'calculator'
        }
      },
      {
        path: 'crypto',
        name: 'CryptoTools',
        component: () => import('@/views/tools/CryptoTools.vue'),
        meta: {
          title: '加解密工具',
          icon: 'lock'
        }
      }
    ]
  },
  {
    path: '/tools/crypto/base64',
    name: 'Base64Convert',
    component: () => import('@/views/tools/crypto/Base64Convert.vue'),
    meta: {
      title: 'Base64转换',
      keepAlive: true
    }
  },
  {
    path: '/tools/crypto/md5',
    name: 'MD5Encrypt',
    component: () => import('@/views/tools/crypto/MD5Encrypt.vue'),
    meta: {
      title: 'MD5加密',
      keepAlive: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于我们',
      keepAlive: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '在线工具箱'} - 工具箱合集`
  next()
})

export default router 