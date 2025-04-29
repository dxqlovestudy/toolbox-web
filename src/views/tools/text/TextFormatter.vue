<!--
 * @author dengxingquan
 * @date 2023-04-25
 * @description 文本格式化工具
 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { CopyDocument, Back } from '@element-plus/icons-vue'

const router = useRouter()

// 格式类型
const formatTypes = [
  { label: 'JSON', value: 'json' },
  { label: 'XML', value: 'xml' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'js' },
  { label: 'SQL', value: 'sql' }
]

const inputText = ref('')
const outputText = ref('')
const selectedFormat = ref('json')
const indentSize = ref(2)
const isLoading = ref(false)
const errorMessage = ref('')

// 是否可以格式化
const canFormat = computed(() => {
  return inputText.value.trim().length > 0
})

// JSON格式化
const formatJSON = (text: string, indent: number) => {
  try {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, indent)
  } catch (err: any) {
    errorMessage.value = `JSON格式化错误: ${err.message}`
    return text
  }
}

// XML格式化（简单实现，实际项目中可以使用专业库）
const formatXML = (text: string, indent: number) => {
  try {
    text = text.replace(/>\s*</g, '>\n<')
    let formatted = ''
    let indentation = 0
    
    text.split('\n').forEach(line => {
      if (line.match(/<\/[^>]+>/)) {
        indentation -= indent
      }
      
      formatted += ' '.repeat(Math.max(0, indentation)) + line + '\n'
      
      if (line.match(/<[^>]+>/) && !line.match(/<\/[^>]+>/) && !line.match(/\/>/)) {
        indentation += indent
      }
    })
    
    return formatted.trim()
  } catch (err: any) {
    errorMessage.value = `XML格式化错误: ${err.message}`
    return text
  }
}

// 格式化处理
const formatText = () => {
  if (!canFormat.value) return
  
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const text = inputText.value.trim()
    
    setTimeout(() => {
      switch (selectedFormat.value) {
        case 'json':
          outputText.value = formatJSON(text, indentSize.value)
          break
        case 'xml':
          outputText.value = formatXML(text, indentSize.value)
          break
        default:
          // 其他格式化类型在实际项目中实现
          outputText.value = text
          errorMessage.value = `${selectedFormat.value.toUpperCase()}格式化暂未实现`
      }
      
      isLoading.value = false
    }, 300) // 模拟处理延迟
  } catch (err: any) {
    errorMessage.value = `格式化错误: ${err.message}`
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
  router.push('/tools/text')
}
</script>

<template>
  <div class="formatter-container">
    <div class="tool-nav">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/tools/text' }">文本处理工具</el-breadcrumb-item>
        <el-breadcrumb-item>文本格式化</el-breadcrumb-item>
      </el-breadcrumb>
      
      <el-button type="text" @click="goBack" class="back-button">
        <el-icon><Back /></el-icon> 返回上层
      </el-button>
    </div>
    
    <h1 class="toolbox-title">文本格式化</h1>
    
    <div class="tool-options">
      <el-form :inline="true">
        <el-form-item label="格式类型">
          <el-select v-model="selectedFormat" placeholder="选择格式类型">
            <el-option
              v-for="item in formatTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="缩进大小">
          <el-input-number
            v-model="indentSize"
            :min="0"
            :max="8"
            size="default"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            @click="formatText" 
            :disabled="!canFormat" 
            :loading="isLoading"
          >
            格式化
          </el-button>
          <el-button @click="clearContent">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <div class="formatter-content">
      <div class="formatter-input">
        <div class="area-header">
          <span>输入</span>
        </div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="15"
          placeholder="请输入需要格式化的文本..."
          @keydown.ctrl.enter="formatText"
        />
      </div>
      
      <div class="formatter-output">
        <div class="area-header">
          <span>输出</span>
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
          :rows="15"
          readonly
          placeholder="格式化后的结果将显示在这里..."
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
      <h3>使用说明：</h3>
      <ol>
        <li>选择需要格式化的文本类型</li>
        <li>在左侧文本框中粘贴或输入需要格式化的内容</li>
        <li>点击"格式化"按钮，或使用快捷键 Ctrl+Enter</li>
        <li>格式化后的结果将显示在右侧文本框中</li>
        <li>可以点击"复制"按钮将结果复制到剪贴板</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.formatter-container {
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

.formatter-content {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.formatter-input,
.formatter-output {
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

.tool-tips ol {
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
  
  .formatter-content {
    flex-direction: column;
  }
}
</style> 