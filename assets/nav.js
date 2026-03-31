/**
 * Agent Platform Docs Blog - Navigation & Interactivity
 */

(function () {
  'use strict';

  /* ======================================================
     Nav data - all pages
     ====================================================== */
  const NAV_DATA = [
    {
      section: '入门',
      items: [
        { label: '项目概述', href: 'index.html', icon: '🏠' },
        { label: '快速开始', href: '01-quickstart.html', icon: '🚀' },
      ]
    },
    {
      section: '架构',
      items: [
        {
          label: '系统架构', href: '02-architecture.html', icon: '🏗️',
          sub: [
            { label: '整体架构设计', href: '02-architecture.html#overview' },
            { label: '数据流架构', href: '02-architecture.html#dataflow' },
            { label: '部署架构', href: '02-architecture.html#deploy' },
            { label: '安全架构', href: '02-architecture.html#security' },
          ]
        },
      ]
    },
    {
      section: '核心模块',
      items: [
        {
          label: '前端应用', href: '03-frontend.html', icon: '🖥️',
          sub: [
            { label: '应用结构', href: '03-frontend.html#structure' },
            { label: '组件架构', href: '03-frontend.html#components' },
            { label: '状态管理', href: '03-frontend.html#state' },
            { label: 'API 集成', href: '03-frontend.html#api' },
            { label: '认证系统', href: '03-frontend.html#auth' },
          ]
        },
        {
          label: '后端服务', href: '04-backend.html', icon: '⚙️',
          sub: [
            { label: 'LangGraph 架构', href: '04-backend.html#langgraph' },
            { label: '任务处理系统', href: '04-backend.html#task' },
            { label: 'LLM 集成', href: '04-backend.html#llm' },
            { label: '流式响应处理', href: '04-backend.html#stream' },
          ]
        },
        { label: '用户管理系统', href: '05-user-management.html', icon: '👥' },
        {
          label: 'RAG 功能模块', href: '06-rag.html', icon: '📚',
          sub: [
            { label: '插件系统', href: '06-rag.html#plugins' },
            { label: '数据源连接器', href: '06-rag.html#datasource' },
            { label: '文档处理系统', href: '06-rag.html#docproc' },
            { label: '检索增强系统', href: '06-rag.html#retrieval' },
            { label: 'API 服务接口', href: '06-rag.html#api' },
          ]
        },
        {
          label: '算法处理系统', href: '07-algorithm.html', icon: '🤖',
          sub: [
            { label: 'FCOS 算法', href: '07-algorithm.html#fcos' },
            { label: '多场景适配', href: '07-algorithm.html#scenes' },
            { label: '训练流程', href: '07-algorithm.html#training' },
            { label: '推理优化', href: '07-algorithm.html#inference' },
          ]
        },
      ]
    },
    {
      section: '运维',
      items: [
        {
          label: '部署与运维', href: '08-deployment.html', icon: '🐳',
          sub: [
            { label: '开发环境', href: '08-deployment.html#dev' },
            { label: '容器化部署', href: '08-deployment.html#docker' },
            { label: '反向代理', href: '08-deployment.html#nginx' },
            { label: '监控运维', href: '08-deployment.html#monitor' },
          ]
        },
      ]
    },
    {
      section: '参考',
      items: [
        {
          label: 'API 参考', href: '09-api-reference.html', icon: '📡',
          sub: [
            { label: 'LangGraph API', href: '09-api-reference.html#langgraph' },
            { label: '认证 API', href: '09-api-reference.html#auth' },
            { label: 'RAG API', href: '09-api-reference.html#rag' },
            { label: '网关 API', href: '09-api-reference.html#gateway' },
          ]
        },
        { label: '开发指南', href: '10-dev-guide.html', icon: '📖' },
        { label: '故障排除', href: '11-troubleshooting.html', icon: '🔧' },
      ]
    },
  ];

  /* ======================================================
     Sidebar render
     ====================================================== */
  function renderSidebar() {
    const container = document.getElementById('sidebar-nav');
    if (!container) return;

    const currentPage = getCurrentPage();
    let html = '';

    NAV_DATA.forEach(group => {
      html += `<li class="nav-section"><span class="nav-section-title">${group.section}</span></li>`;
      group.items.forEach(item => {
        const isActive = currentPage === item.href || (item.sub && item.sub.some(s => currentPage === item.href));
        const hasSubActive = item.sub && item.sub.some(s => window.location.href.includes(item.href));
        const isOpen = isActive || hasSubActive;

        if (item.sub) {
          html += `
            <li class="nav-item has-sub ${isOpen ? 'open' : ''}">
              <a href="${item.href}" class="${isActive ? 'active' : ''}">
                <span class="nav-icon">${item.icon}</span>
                ${item.label}
                <span class="nav-chevron">▼</span>
              </a>
              <ul class="nav-sub">
                ${item.sub.map(s => `
                  <li class="nav-sub-item">
                    <a href="${s.href}">${s.label}</a>
                  </li>
                `).join('')}
              </ul>
            </li>`;
        } else {
          html += `
            <li class="nav-item">
              <a href="${item.href}" class="${isActive ? 'active' : ''}">
                <span class="nav-icon">${item.icon}</span>
                ${item.label}
              </a>
            </li>`;
        }
      });
    });

    container.innerHTML = html;

    // Toggle sub-menus
    container.querySelectorAll('.nav-item.has-sub > a').forEach(link => {
      link.addEventListener('click', function (e) {
        const li = this.closest('.nav-item.has-sub');
        const isOpen = li.classList.contains('open');
        // Allow navigation to the page itself
        if (!isOpen) {
          e.preventDefault();
          li.classList.toggle('open');
        }
      });
    });
  }

  /* ======================================================
     TOC generation
     ====================================================== */
  function buildTOC() {
    const article = document.querySelector('.article');
    const tocList = document.getElementById('toc-list');
    if (!article || !tocList) return;

    const headings = article.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    let html = '';
    headings.forEach((h, i) => {
      if (!h.id) h.id = 'heading-' + i;
      const cls = h.tagName === 'H3' ? 'toc-h3' : '';
      html += `<li><a href="#${h.id}" class="${cls}">${h.textContent}</a></li>`;
    });

    tocList.innerHTML = html;
  }

  /* ======================================================
     TOC highlight on scroll
     ====================================================== */
  function initTOCHighlight() {
    const tocLinks = document.querySelectorAll('#toc-list a');
    if (tocLinks.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            tocLinks.forEach(a => a.classList.remove('active'));
            const activeLink = document.querySelector(`#toc-list a[href="#${entry.target.id}"]`);
            if (activeLink) activeLink.classList.add('active');
          }
        });
      },
      {
        rootMargin: `-${56 + 20}px 0px -70% 0px`,
        threshold: 0
      }
    );

    document.querySelectorAll('.article h2, .article h3').forEach(h => observer.observe(h));
  }

  /* ======================================================
     Mobile sidebar toggle
     ====================================================== */
  function initMobileSidebar() {
    const btn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!btn || !sidebar) return;

    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
  }

  /* ======================================================
     Helpers
     ====================================================== */
  function getCurrentPage() {
    const path = window.location.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1] || 'index.html';
  }

  /* ======================================================
     Smooth scroll for anchor links
     ====================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const target = document.getElementById(this.getAttribute('href').slice(1));
        if (target) {
          e.preventDefault();
          const offset = 56 + 24;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  /* ======================================================
     Copy code buttons
     ====================================================== */
  function initCopyButtons() {
    document.querySelectorAll('pre').forEach(pre => {
      const btn = document.createElement('button');
      btn.textContent = '复制';
      btn.style.cssText = `
        position: absolute; top: 8px; right: 40px;
        font-size: 11px; padding: 3px 10px;
        background: rgba(255,255,255,0.08); color: #9ca3af;
        border: 1px solid rgba(255,255,255,0.12); border-radius: 4px;
        cursor: pointer; transition: all 0.15s; font-family: var(--font-sans);
      `;
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        const text = code ? code.textContent : pre.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '已复制!';
          btn.style.color = '#10b981';
          setTimeout(() => { btn.textContent = '复制'; btn.style.color = '#9ca3af'; }, 2000);
        });
      });
      pre.style.position = 'relative';
      pre.appendChild(btn);
    });
  }

  /* ======================================================
     Init
     ====================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    renderSidebar();
    buildTOC();
    initTOCHighlight();
    initMobileSidebar();
    initSmoothScroll();
    initCopyButtons();
  });

})();
