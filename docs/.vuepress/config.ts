import { defineConfig } from 'vuepress/config'

export default defineConfig((ctx) => ({
  title: '前端小站',
  /**
   * Type is `DefaultThemeConfig`
   */

  base: '/docs/',
  description: '起风了 唯有努力生存',
  themeConfig: {
    repo: 'https://github.com/Cwd295645351/docs',
    repoLabel: '查看源码',
    editLinks: true,
    docsDir: 'docs',
    docsBranch: 'main',

    search: true,
    searchMaxSuggestions: 10,

    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    nav: [
      { text: 'JS & TS', link: '/js_ts/' },
      { text: '设计模式', link: '/design/' },
      { text: 'Vue 学习', link: '/vue/' },
      { text: '工程化', link: '/engineer/' },
      { text: '即用代码块', link: '/code/' },
      { text: '掘金文章总览', link: '/juejin/all.html' },
      { text: '优质文章赏析', link: '/articles/' },
    ],
    smoothScroll: true,
    sidebar: {
      '/design/': ['', 'adapter', 'combination', 'decorator', 'chain-of-responsibility', 'publish-subcribe', 'proxy', 'single', 'status', 'strategy'],
      '/vue/': ['', 'pinia', 'vue2', 'vuex', 'render'],
      '/engineer/': ['', 'nvm_nrm'],
      '/js_ts/': ['', 'typescript', 'curry', 'debounds', 'spread', 'call_apply_bind', 'function_code', 'webcomponents'],
      '/code/': ['', 'prettier', 'mongodb', 'nginx', 'postcss', 'pm2', 'git-commit'],
    },

    sidebarDepth: 2,
    lastUpdated: 'Last Updated', // string | boolean
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: ['@vuepress/plugin-back-to-top'],
}))
