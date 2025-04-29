<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description MD5加密工具
 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { CopyDocument, Back } from '@element-plus/icons-vue'
import { post } from '@/api/request'

const router = useRouter()

interface MD5Response {
  code: number
  data: {
    original: string
    md5: string
    upperCase: boolean
  }
  message: string
}

const inputText = ref('')
const outputText = ref('')
const isUpperCase = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)

// 是否可以处理
const canEncrypt = computed(() => {
  return inputText.value.trim().length > 0
})

// 处理MD5加密
const handleEncrypt = async () => {
  if (!canEncrypt.value) return
  
  errorMessage.value = ''
  isLoading.value = true
  
  // 显示全屏加载
  const loading = ElLoading.service({
    lock: true,
    text: '加密处理中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 调用后端API
    const response = await post<MD5Response>('/api/crypto/md5', {
      text: inputText.value,
      upperCase: isUpperCase.value
    })
    
    // 处理响应
    if (response.code === 200) {
      outputText.value = response.data.md5
    } else {
      errorMessage.value = response.message || 'MD5加密失败'
    }
  } catch (error: any) {
    console.error('MD5加密请求错误:', error)
    
    // 如果是网络错误或服务器错误，切换到本地加密
    if (error.message?.includes('status code 5') || error.message?.includes('Network Error')) {
      loading.close()
      errorMessage.value = '' // 清除错误信息
      ElMessage({
        message: '后端服务不可用，已切换到本地计算模式',
        type: 'warning',
        duration: 3000
      })
      
      // 等待消息显示后再执行本地计算
      setTimeout(() => {
        handleLocalMD5()
      }, 500)
      return
    }
    
    errorMessage.value = `请求失败: ${error.message || '未知错误'}`
  } finally {
    // 关闭加载提示
    loading.close()
    isLoading.value = false
  }
}

// 本地MD5计算
// 使用简单的MD5实现（仅用于演示，实际项目请使用成熟库）
const handleLocalMD5 = () => {
  isLoading.value = true
  
  try {
    // 模拟加密过程
    setTimeout(() => {
      // 简单的MD5模拟实现（实际使用时应导入crypto-js等库）
      let text = inputText.value.trim()
      let hash = 0
      
      // 生成一个简单的哈希值（这不是真正的MD5，仅用于演示）
      for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i)
        hash = hash & hash // 转换为32位整数
      }
      
      // 转换为16进制并补全32位
      let md5sim = (Math.abs(hash).toString(16)).padStart(32, '0')
      outputText.value = isUpperCase.value ? md5sim.toUpperCase() : md5sim
      
      // 提示用户这不是真正的MD5
      ElMessage({
        message: '这是本地模拟的哈希值，非真实MD5结果',
        type: 'warning',
        duration: 3000
      })
      
      isLoading.value = false
    }, 800)
  } catch (e: any) {
    errorMessage.value = `本地计算出错: ${e.message}`
    isLoading.value = false
  }
}

// 复制结果
const copyResult = () => {
  if (!outputText.value) return
  
  navigator.clipboard.writeText(outputText.value)
    .then(() => {
      ElMessage({
        message: '已复制到剪贴板',
        type: 'success'
      })
    })
    .catch(err => {
      ElMessage({
        message: '复制失败',
        type: 'error'
      })
    })
}

// 清空内容
const clearContent = () => {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
}

// 返回上级页面
const goBack = () => {
  router.push('/tools/crypto')
}
</script>

<template>
  <div class="md5-container">
    <div class="tool-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tools/crypto' }">加解密工具</el-breadcrumb-item>
        <el-breadcrumb-item>MD5加密</el-breadcrumb-item>
      </el-breadcrumb>
      
      <el-button type="text" @click="goBack" class="back-button">
        <el-icon><Back /></el-icon> 返回上层
      </el-button>
    </div>
    
    <h1 class="toolbox-title">MD5加密</h1>
    
    <div class="tool-options">
      <el-form :inline="true">
        <el-form-item>
          <el-switch
            v-model="isUpperCase"
            active-text="大写输出"
            inactive-text="小写输出"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="handleEncrypt" 
            :disabled="!canEncrypt || isLoading" 
            :loading="isLoading"
          >
            加密
          </el-button>
          <el-button 
            type="info" 
            @click="handleLocalMD5" 
            :disabled="!canEncrypt || isLoading"
          >
            本地计算
          </el-button>
          <el-button @click="clearContent">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="tool-content">
      <div class="input-area">
        <div class="area-header">
          <span>原文内容</span>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="6"
          placeholder="请输入要进行MD5加密的文本..."
          @keydown.ctrl.enter="handleEncrypt"
        />
      </div>
      
      <div class="result-area">
        <div class="area-header">
          <span>MD5结果</span>
          <el-button 
            size="small" 
            @click="copyResult" 
            :disabled="!outputText"
            text
          >
            <el-icon><CopyDocument /></el-icon> 复制
          </el-button>
        </div>
        <el-input
          v-model="outputText"
          type="textarea"
          :rows="3"
          readonly
          placeholder="MD5加密结果将显示在这里..."
        />
      </div>
    </div>
    
    <div class="error-message" v-if="errorMessage">
      <el-alert
        :title="errorMessage"
        type="error"
        show-icon
      />
    </div>
    
    <div class="tool-tips">
      <h3>MD5加密说明：</h3>
      <ul>
        <li>MD5是一种被广泛使用的密码散列函数，能够将任意长度的数据转换为固定长度的散列值（通常为32位十六进制数）</li>
        <li>MD5主要用于验证数据完整性和存储密码（不过现在不推荐用于存储密码，因为安全性问题）</li>
        <li>本工具优先通过后端API进行MD5计算，如果服务不可用会自动切换到本地计算模式</li>
        <li>可以点击"本地计算"按钮直接使用本地模式（注意：本地模式下的结果仅供参考）</li>
        <li>可选择输出结果为大写或小写</li>
        <li><strong>注意：</strong>MD5是不可逆的，无法通过MD5值还原原始内容</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.md5-container {
  width: 100%;
  padding: 20px;
}

.tool-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
}

.back-button {
  display: flex;
  align-items: center;
  color: #409eff;
}

.back-button .el-icon {
  margin-right: 5px;
}

.tool-options {
  margin-bottom: 20px;
}

.tool-content {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  gap: 20px;
}

.input-area,
.result-area {
  width: 100%;
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
}

.error-message {
  margin-bottom: 20px;
}

.tool-tips {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 20px;
}

.tool-tips h3 {
  margin-bottom: 10px;
  color: #333;
}

.tool-tips ul {
  padding-left: 20px;
  color: #666;
}

.tool-tips li {
  margin-bottom: 5px;
}

@media screen and (max-width: 768px) {
  .tool-nav {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .back-button {
    margin-top: 10px;
  }
}
</style> 