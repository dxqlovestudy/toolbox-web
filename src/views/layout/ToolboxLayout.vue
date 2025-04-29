<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 工具箱主布局组件
 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToolboxStore } from '@/stores/toolbox'
import { 
  House, 
  Tools, 
  Document, 
  Picture, 
  RefreshRight, 
  Opportunity,
  Lock,
  CaretRight,
  CaretLeft
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const toolboxStore = useToolboxStore()

// 是否折叠侧边栏
const isCollapse = ref(false)

// 获取当前路由信息
const currentCategory = computed(() => {
  const path = route.path
  if (path.includes('/tools/text')) return '文本工具'
  if (path.includes('/tools/image')) return '图片工具'
  if (path.includes('/tools/converter')) return '格式转换'
  if (path.includes('/tools/calculator')) return '计算工具'
  if (path.includes('/tools/crypto')) return '加解密工具'
  return '全部工具'
})

// 侧边栏菜单
const sideMenus = computed(() => {
  return [
    {
      index: '/tools/text',
      title: '文本工具',
      icon: 'Document'
    },
    {
      index: '/tools/image',
      title: '图片工具',
      icon: 'Picture'
    },
    {
      index: '/tools/converter',
      title: '格式转换',
      icon: 'RefreshRight'
    },
    {
      index: '/tools/calculator',
      title: '计算工具',
      icon: 'Opportunity'
    },
    {
      index: '/tools/crypto',
      title: '加解密工具',
      icon: 'Lock'
    }
  ]
})

// 返回首页
const goHome = () => {
  router.push('/')
}

// 折叠侧边栏
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 导航到菜单项
const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 搜索处理
const searchKeyword = ref('')
const handleSearch = () => {
  toolboxStore.setSearchKeyword(searchKeyword.value)
}
</script>

<template>
  <div class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="logo" @click="goHome">
        <el-icon><Tools /></el-icon>
        <span v-if="!isCollapse">工具箱合集</span>
      </div>
      
      <div class="header-right">
        <div class="search-container">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索工具..."
            @keyup.enter="handleSearch"
          />
        </div>
        
        <el-button @click="goHome" text>
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-button>
      </div>
    </el-header>
    
    <el-container class="main-container">
      <!-- 侧边菜单 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar">
        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon v-if="isCollapse"><CaretRight /></el-icon>
          <el-icon v-else><CaretLeft /></el-icon>
          <span v-if="!isCollapse" class="toggle-text">收起菜单</span>
        </div>
        
        <el-menu
          :default-active="route.path"
          :collapse="isCollapse"
          @select="handleMenuSelect"
          router
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
        >
          <el-menu-item v-for="menu in sideMenus" :key="menu.index" :index="menu.index">
            <el-icon>
              <component :is="menu.icon" />
            </el-icon>
            <template #title>{{ menu.title }}</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="main-content">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentCategory }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="content-container">
          <router-view />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #409EFF;
  cursor: pointer;
}

.logo .el-icon {
  margin-right: 8px;
  font-size: 1.5rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.search-container {
  margin-right: 20px;
  width: 260px;
}

.main-container {
  flex: 1;
  overflow: hidden;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  position: relative;
  overflow-x: hidden;
  z-index: 1;
}

.sidebar-toggle {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #bfcbd9;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 10px;
  background-color: rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.sidebar-toggle::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(to right, transparent, rgba(64, 158, 255, 0.1), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.sidebar-toggle:hover {
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
}

.sidebar-toggle:hover::after {
  transform: translateX(100%);
}

.sidebar-toggle .el-icon {
  font-size: 20px;
  color: #fff;
  transition: transform 0.3s;
}

.sidebar-toggle:hover .el-icon {
  transform: scale(1.2);
}

.toggle-text {
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
}

.main-content {
  background-color: #f5f7fa;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.content-container {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  min-height: calc(100% - 40px);
}
</style> 