/**
 * @author dengxingquan
 * @date 2023-04-25
 * @description 工具箱状态管理
 */
import { defineStore } from 'pinia'

export interface ToolItem {
  id: string
  name: string
  icon: string
  description: string
  category: string
  path: string
  favorite: boolean
}

interface ToolboxState {
  tools: ToolItem[]
  recentlyUsed: string[]
  favorites: string[]
  categories: string[]
  searchKeyword: string
}

export const useToolboxStore = defineStore('toolbox', {
  state: (): ToolboxState => ({
    tools: [],
    recentlyUsed: [],
    favorites: [],
    categories: ['文本工具', '图片工具', '格式转换', '计算工具', '加解密工具'],
    searchKeyword: ''
  }),
  
  getters: {
    // 获取所有工具
    getAllTools: (state) => state.tools,
    
    // 获取收藏的工具
    getFavoriteTools: (state) => state.tools.filter(tool => state.favorites.includes(tool.id)),
    
    // 获取最近使用的工具
    getRecentlyUsedTools: (state) => {
      return state.recentlyUsed
        .map(id => state.tools.find(tool => tool.id === id))
        .filter(Boolean) as ToolItem[]
    },
    
    // 按分类获取工具
    getToolsByCategory: (state) => (category: string) => {
      return state.tools.filter(tool => tool.category === category)
    },
    
    // 搜索工具
    searchTools: (state) => {
      if (!state.searchKeyword.trim()) return []
      const keyword = state.searchKeyword.toLowerCase()
      return state.tools.filter(tool => 
        tool.name.toLowerCase().includes(keyword) || 
        tool.description.toLowerCase().includes(keyword)
      )
    }
  },
  
  actions: {
    // 初始化工具列表
    initTools(tools: ToolItem[]) {
      this.tools = tools
    },
    
    // 添加工具到最近使用
    addToRecentlyUsed(toolId: string) {
      // 如果已存在，先移除
      this.recentlyUsed = this.recentlyUsed.filter(id => id !== toolId)
      // 添加到最前面
      this.recentlyUsed.unshift(toolId)
      // 最多保留10个
      if (this.recentlyUsed.length > 10) {
        this.recentlyUsed.pop()
      }
    },
    
    // 添加/移除收藏
    toggleFavorite(toolId: string) {
      const index = this.favorites.indexOf(toolId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(toolId)
      }
    },
    
    // 设置搜索关键词
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
    }
  }
}) 