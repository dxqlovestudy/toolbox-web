<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description Base64编解码工具
 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { RefreshRight, CopyDocument, Back } from '@element-plus/icons-vue'

const router = useRouter()
const inputText = ref('')
const outputText = ref('')
const mode = ref('encode') // encode or decode
const isLoading = ref(false)
const errorMessage = ref('')

// 是否可以处理
const canProcess = computed(() => {
  return inputText.value.trim().length > 0
})

// Base64编码
const encodeBase64 = (text: string) => {
  try {
    // 使用浏览器内置的btoa函数进行Base64编码
    // 注意：btoa不能直接处理Unicode字符串，需要先进行UTF-8编码
    const utf8Bytes = new TextEncoder().encode(text)
    const base64 = btoa(
      Array.from(utf8Bytes)
        .map(byte => String.fromCharCode(byte))
        .join('')
    )
    return base64
  } catch (err: any) {
    errorMessage.value = `Base64编码错误: ${err.message}`
    return text
  }
}

// Base64解码
const decodeBase64 = (base64: string) => {
  try {
    // 使用浏览器内置的atob函数进行Base64解码
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    
    return new TextDecoder().decode(bytes)
  } catch (err: any) {
    errorMessage.value = `Base64解码错误: ${err.message}`
    return base64
  }
}

// 处理转换
const processConversion = () => {
  if (!canProcess.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const text = inputText.value.trim()
    
    setTimeout(() => {
      if (mode.value === 'encode') {
        outputText.value = encodeBase64(text)
      } else {
        outputText.value = decodeBase64(text)
      }
      
      isLoading.value = false
    }, 300) // 模拟处理延迟
  } catch (err: any) {
    errorMessage.value = `处理错误: ${err.message}`
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

// 交换输入和输出
const swapTexts = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
  // 切换模式
  mode.value = mode.value === 'encode' ? 'decode' : 'encode'
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
  <div class="base64-container">
    <div class="tool-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tools/crypto' }">加解密工具</el-breadcrumb-item>
        <el-breadcrumb-item>Base64转换</el-breadcrumb-item>
      </el-breadcrumb>
      
      <el-button type="text" @click="goBack" class="back-button">
        <el-icon><Back /></el-icon> 返回上层
      </el-button>
    </div>
    
    <h1 class="toolbox-title">Base64转换</h1>
    
    <div class="tool-options">
      <el-form :inline="true">
        <el-form-item label="转换模式">
          <el-radio-group v-model="mode">
            <el-radio-button label="encode">编码(加密)</el-radio-button>
            <el-radio-button label="decode">解码(解密)</el-radio-button>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="processConversion" 
            :disabled="!canProcess" 
            :loading="isLoading"
          >
            {{ mode === 'encode' ? '编码' : '解码' }}
          </el-button>
          <el-button @click="swapTexts" :disabled="!outputText">
            <el-icon><RefreshRight /></el-icon> 交换
          </el-button>
          <el-button @click="clearContent">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="converter-content">
      <div class="converter-input">
        <div class="area-header">
          <span>{{ mode === 'encode' ? '待编码文本' : '待解码Base64' }}</span>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="12"
          :placeholder="mode === 'encode' ? '请输入要编码的文本...' : '请输入要解码的Base64字符串...'"
          @keydown.ctrl.enter="processConversion"
        />
      </div>
      
      <div class="converter-output">
        <div class="area-header">
          <span>{{ mode === 'encode' ? 'Base64结果' : '解码结果' }}</span>
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
          :rows="12"
          readonly
          :placeholder="mode === 'encode' ? 'Base64编码结果将显示在这里...' : '解码结果将显示在这里...'"
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
      <h3>Base64转换说明：</h3>
      <ul>
        <li>Base64是一种基于64个可打印字符来表示二进制数据的方法</li>
        <li>可用于在HTTP环境下传递较长的标识信息</li>
        <li>编码选项可将普通文本转为Base64编码</li>
        <li>解码选项可将Base64编码还原为原始文本</li>
        <li>支持Unicode字符的编码转换</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.base64-container {
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

.converter-content {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.converter-input,
.converter-output {
  flex: 1;
  display: flex;
  flex-direction: column;
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
  
  .converter-content {
    flex-direction: column;
  }
}
</style> 