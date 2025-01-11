import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import ProjectDetail from '@/views/ProjectDetail.vue';
import AdminProjects from '@/views/admin/ProjectList.vue';
import ProjectEdit from '@/views/admin/ProjectEdit.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetail
    },
    {
      path: '/admin',
      children: [
        {
          path: 'projects',
          name: 'admin-projects',
          component: AdminProjects
        },
        {
          path: 'projects/new',
          name: 'project-create',
          component: ProjectEdit
        },
        {
          path: 'projects/:id/edit',
          name: 'project-edit',
          component: ProjectEdit
        }
      ]
    }
  ]
});

export default router; 