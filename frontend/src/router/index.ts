import { createRouter, createWebHistory } from 'vue-router';
import Front from '@/views/Front.vue';
import Admin from '@/views/admin/Admin.vue';
import Login from '@/views/admin/Login.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 前台路由
    {
      path: '/',
      component: Front,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Home.vue')
        },
        {
          path: 'projects/:id',
          name: 'project-detail',
          component: () => import('@/views/ProjectDetail.vue')
        },
        {
          path: 'tags/:id',
          name: 'tag-projects',
          component: () => import('@/views/TagProjects.vue')
        }
      ]
    },
    // 后台路由
    {
      path: '/admin/login',
      component: Login
    },
    {
      path: '/admin',
      component: Admin,
      children: [
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('@/views/admin/ProjectList.vue')
        },
        {
          path: 'projects/new',
          name: 'admin-project-new',
          component: () => import('@/views/admin/ProjectEdit.vue')
        },
        {
          path: 'projects/:id/edit',
          name: 'admin-project-edit',
          component: () => import('@/views/admin/ProjectEdit.vue')
        },
        {
          path: 'tags',
          name: 'admin-tags',
          component: () => import('@/views/admin/TagList.vue')
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: () => import('@/views/admin/Settings.vue')
        }
      ],
      beforeEnter: (to, from, next) => {
        const token = localStorage.getItem('admin_token');
        if (!token && to.path !== '/admin/login') {
          next('/admin/login');
        } else {
          next();
        }
      }
    }
  ]
});

export default router; 