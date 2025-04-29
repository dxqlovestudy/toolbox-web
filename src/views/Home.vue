<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 工具箱首页
 -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolboxStore } from '@/stores/toolbox'
import type { ToolItem } from '@/stores/toolbox'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const toolboxStore = useToolboxStore()

const searchKeyword = ref('')
const popularTools = ref<ToolItem[]>([])
const recentTools = ref<ToolItem[]>([])

// 模拟工具数据
const mockTools: ToolItem[] = [
  {
    id: 'text-formatter',
    name: '文本格式化',
    icon: 'Document',
    description: '格式化JSON、XML、HTML等文本内容',
    category: '文本工具',
    path: '/tools/text/formatter',
    favorite: false
  },
  {
    id: 'image-compressor',
    name: '图片压缩',
    icon: 'Picture',
    description: '压缩图片大小而不损失太多质量',
    category: '图片工具',
    path: '/tools/image/compressor',
    favorite: false
  },
  {
    id: 'json-to-xml',
    name: 'JSON转XML',
    icon: 'Refresh',
    description: '将JSON格式数据转换为XML格式',
    category: '格式转换',
    path: '/tools/converter/json-to-xml',
    favorite: false
  },
  {
    id: 'unit-converter',
    name: '单位换算',
    icon: 'Switch',
    description: '各种单位之间的相互换算',
    category: '计算工具',
    path: '/tools/calculator/unit-converter',
    favorite: false
  },
  {
    id: 'qrcode-generator',
    name: '二维码生成',
    icon: 'Grid',
    description: '生成自定义内容的二维码',
    category: '图片工具',
    path: '/tools/image/qrcode',
    favorite: false
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    icon: 'Lock',
    description: '生成安全的随机密码',
    category: '文本工具',
    path: '/tools/text/password',
    favorite: false
  },
  {
    id: 'base64-convert',
    name: 'Base64转换',
    icon: 'Connection',
    description: '文本与Base64编码相互转换',
    category: '加解密工具',
    path: '/tools/crypto/base64',
    favorite: false
  },
  {
    id: 'md5-encrypt',
    name: 'MD5加密',
    icon: 'Lock',
    description: '将文本转换为MD5哈希值',
    category: '加解密工具',
    path: '/tools/crypto/md5',
    favorite: false
  }
]

onMounted(() => {
  // 初始化工具数据
  toolboxStore.initTools(mockTools)
  
  // 获取热门工具和最近使用的工具
  popularTools.value = mockTools.slice(0, 4)
  recentTools.value = toolboxStore.getRecentlyUsedTools
})

// 处理搜索
const handleSearch = () => {
  toolboxStore.setSearchKeyword(searchKeyword.value)
  
  if (searchKeyword.value) {
    router.push('/tools')
  }
}

// 前往工具页面
const goToTool = (tool: ToolItem) => {
  toolboxStore.addToRecentlyUsed(tool.id)
  router.push(tool.path)
}

// 前往工具分类页面
const goToCategory = (category: string) => {
  if (category === '文本工具') {
    router.push('/tools/text')
  } else if (category === '图片工具') {
    router.push('/tools/image')
  } else if (category === '格式转换') {
    router.push('/tools/converter')
  } else if (category === '计算工具') {
    router.push('/tools/calculator')
  } else if (category === '加解密工具') {
    router.push('/tools/crypto')
  } else {
    router.push('/tools')
  }
}
</script>

<template>
  <div class="home-container">
    <div class="banner">
      <h1>在线工具箱合集</h1>
      <p class="subtitle">提供各种好用的在线工具，方便您的日常工作与生活</p>
      
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索工具..."
          :prefix-icon="Search"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>
    
    <!-- 工具分类 -->
    <div class="section">
      <h2 class="section-title">工具分类</h2>
      <div class="category-list">
        <el-row :gutter="20">
          <el-col :span="6" v-for="category in toolboxStore.categories" :key="category">
            <div class="category-card" @click="goToCategory(category)">
              <div class="category-icon" :class="category">
                <el-icon :size="32">
                  <component :is="category === '文本工具' ? 'Document' : 
                            category === '图片工具' ? 'Picture' : 
                            category === '格式转换' ? 'RefreshRight' : 'Calculator'" />
                </el-icon>
              </div>
              <div class="category-name">{{ category }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 热门工具 -->
    <div class="section">
      <h2 class="section-title">热门工具</h2>
      <div class="tool-list">
        <el-row :gutter="20">
          <el-col :span="6" v-for="tool in popularTools" :key="tool.id">
            <el-card class="tool-card toolbox-card" @click="goToTool(tool)">
              <div class="tool-icon">
                <el-icon :size="28"><component :is="tool.icon" /></el-icon>
              </div>
              <div class="tool-name">{{ tool.name }}</div>
              <div class="tool-desc">{{ tool.description }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 最近使用 -->
    <div class="section" v-if="recentTools.length > 0">
      <h2 class="section-title">最近使用</h2>
      <div class="tool-list">
        <el-row :gutter="20">
          <el-col :span="6" v-for="tool in recentTools" :key="tool.id">
            <el-card class="tool-card toolbox-card" @click="goToTool(tool)">
              <div class="tool-icon">
                <el-icon :size="28"><component :is="tool.icon" /></el-icon>
              </div>
              <div class="tool-name">{{ tool.name }}</div>
              <div class="tool-desc">{{ tool.description }}</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.banner {
  text-align: center;
  padding: 40px 20px;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
  border-radius: 8px;
}

.banner h1 {
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.search-box {
  max-width: 600px;
  margin: 0 auto;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.category-list {
  margin-bottom: 20px;
}

.category-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.category-icon {
  margin-bottom: 15px;
  color: #409eff;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 500;
}

.tool-card {
  height: 100%;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tool-icon {
  margin-bottom: 10px;
  color: #409eff;
}

.tool-name {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.tool-desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  text-align: center;
}
</style> 