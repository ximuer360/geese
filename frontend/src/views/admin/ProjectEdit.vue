<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { getProject, createProject, updateProject } from '@/api/project';
import { getTags } from '@/api/tag';
import type { Tag } from '@/api/tag';

// 导入样式
import 'bytemd/dist/index.css';
import 'highlight.js/styles/vs2015.css';

// Markdown 编辑器插件配置
const plugins = [
  gfm({
    // GFM 功能配置
    emoji: true,
    task: true,
    table: true,
    autolink: true,
    checkbox: true,
    footnotes: true,
    math: true
  }),
  highlight({
    detect: true,
    theme: 'github-dark'
  })
];

const route = useRoute();
const router = useRouter();
const isEdit = route.params.id !== undefined;

interface FormData {
  name: string;
  description: string;
  repoUrl: string;
  language: string;
  stars: number;
  tags: string[];
  images: { url: string }[];
}

const form = ref<FormData>({
  name: '',
  description: '',
  repoUrl: '',
  language: '',
  stars: 0,
  tags: [],
  images: []
});

const loading = ref(false);
const error = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const tags = ref<Tag[]>([]); // 所有标签列表
const selectedTags = ref<string[]>([]); // 已选择的标签
const tagInput = ref(''); // 标签输入框的值
const filteredTags = ref<Tag[]>([]); // 过滤后的标签建议
const showTagSuggestions = ref(false); // 是否显示标签建议

// 分类标签数据
const tagCategories = ref([
  {
    name: '资源类型',
    tags: [] as Tag[]
  },
  {
    name: '技术栈',
    tags: [] as Tag[]
  },
  {
    name: '地区',
    tags: [] as Tag[]
  }
]);

// 获取所有标签并按分类组织
const fetchTags = async () => {
  try {
    const data = await getTags();
    
    // 定义分类规则
    const categoryRules = {
      '资源类型': ['资源部', '网盘资源', '网盘项目', 'B站', '壁纸', '网盘课程'],
      '技术栈': ['Vue', 'React', 'TypeScript', 'JavaScript', 'test'],
      '地区': ['欧洲', '美洲', '亚洲', '魔法英语']
    };

    // 按分类组织标签
    tagCategories.value.forEach(category => {
      // 获取当前分类的规则
      const rules = categoryRules[category.name as keyof typeof categoryRules] || [];
      
      // 过滤标签
      category.tags = data.filter(tag => rules.includes(tag.name));
    });

    // 找出未分类的标签
    const categorizedTags = new Set(
      Object.values(categoryRules).flat()
    );
    
    const uncategorizedTags = data.filter(
      tag => !categorizedTags.has(tag.name)
    );

    // 如果有未分类的标签，添加一个"其他"分类
    if (uncategorizedTags.length > 0) {
      tagCategories.value.push({
        name: '其他',
        tags: uncategorizedTags
      });
    }

    // 如果是编辑模式，设置已选标签
    if (isEdit && form.value.tags) {
      selectedTags.value = form.value.tags.map(tag => tag.id);
    }
  } catch (error) {
    console.error('Failed to fetch tags:', error);
  }
};

// 选择标签
const toggleTag = (tagId: string) => {
  const index = selectedTags.value.indexOf(tagId);
  if (index === -1) {
    selectedTags.value.push(tagId);
  } else {
    selectedTags.value.splice(index, 1);
  }
  // 更新表单的tags字段
  form.value.tags = selectedTags.value;
};

// 检查标签是否被选中
const isTagSelected = (tagId: string) => {
  return selectedTags.value.includes(tagId);
};

// 修改加载项目数据的逻辑
onMounted(async () => {
  await fetchTags(); // 先获取所有标签

  if (isEdit) {
    try {
      loading.value = true;
      const data = await getProject(route.params.id as string);
      form.value = {
        ...data,
        description: data.description?.replace(/\r\n/g, '\n') || '',
        stars: Number(data.stars) || 0,
        tags: data.tags.map(tag => tag.id) // 只保存标签ID
      };
      // 设置已选标签
      selectedTags.value = data.tags.map(tag => tag.id);
    } catch (err: any) {
      error.value = err.response?.data?.error || err.message;
    } finally {
      loading.value = false;
    }
  }
});

// 修改表单提交
const handleSubmit = async (e: Event) => {
  e.preventDefault();
  try {
    loading.value = true;
    // 获取完整的标签信息
    const selectedTagsInfo = selectedTags.value.map(tagId => {
      const tag = tagCategories.value
        .flatMap(category => category.tags)
        .find(t => t.id === tagId);
      return tag;
    }).filter(Boolean);

    // 确保 stars 是数字类型
    const formData = {
      ...form.value,
      stars: Number(form.value.stars) || 0,
      tags: selectedTagsInfo,
      images: form.value.images.map((image, index) => ({
        url: image.url,
        order: index,
        isCover: index === 0
      }))
    };
    
    if (isEdit) {
      await updateProject(route.params.id as string, formData);
    } else {
      await createProject(formData);
    }
    router.push('/admin/projects');
  } catch (err: any) {
    error.value = err.response?.data?.error || err.message;
  } finally {
    loading.value = false;
  }
};

// 修改图片上传处理函数
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    try {
      loading.value = true;
      error.value = ''; // 清除之前的错误信息

      for (const file of Array.from(input.files)) {
        // 检查文件大小
        if (file.size > 10 * 1024 * 1024) { // 10MB
          error.value = '图片大小不能超过10MB';
          continue;
        }

        try {
          // 压缩图片
          const compressedDataUrl = await compressImage(file);
          form.value.images.push({ url: compressedDataUrl });
        } catch (err) {
          console.error('Error compressing image:', err);
          error.value = '图片处理失败，请重试';
        }
      }
    } catch (err: any) {
      error.value = '图片上传失败：' + (err.message || '未知错误');
    } finally {
      loading.value = false;
      if (input) input.value = ''; // 清空 input，允许重复选择相同文件
    }
  }
};

// 优化图片压缩函数
const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // 计算压缩后的尺寸，保持宽高比
        let width = img.width;
        let height = img.height;
        const maxSize = 1200; // 最大尺寸

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height);

        // 转换为 base64，控制质量
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
        
        // 检查压缩后的大小
        const base64Size = compressedDataUrl.length * 0.75; // 估算大小
        if (base64Size > 5 * 1024 * 1024) { // 5MB
          reject(new Error('压缩后的图片仍然太大，请选择更小的图片'));
          return;
        }

        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('图片加载失败'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
};

// 删除图片
const removeImage = (index: number) => {
  form.value.images.splice(index, 1);
};

// 处理 Markdown 内容变化
const handleDescriptionChange = (value: string) => {
  // 保留换行符和空格，处理特殊字符
  form.value.description = value
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');
};
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <form @submit="handleSubmit" class="space-y-6">
      <!-- 项目名称 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          项目名称
        </label>
        <input
          v-model="form.name"
          type="text"
          required
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- 项目描述 - Markdown 编辑器 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          项目描述 (支持 Markdown 格式)
        </label>
        <div class="markdown-editor-container">
          <Editor
            :value="form.description"
            :plugins="plugins"
            @change="handleDescriptionChange"
            :mode="'split'"
            :locale="{
              write: '编辑',
              preview: '预览',
              writeMode: '编辑模式',
              previewMode: '预览模式',
              editMode: '编辑模式',
              splitMode: '分屏模式',
              fullscreen: '全屏',
              exitFullscreen: '退出全屏',
              loading: '加载中...',
              error: '加载失败'
            }"
            placeholder="请输入项目描述，支持 Markdown 格式..."
            class="markdown-editor"
          />
        </div>
      </div>

      <!-- 仓库地址 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          资源地址
        </label>
        <input
          v-model="form.repoUrl"
          type="url"
          required
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- 编程语言 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          编程语言
        </label>
        <input
          v-model="form.language"
          type="text"
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- Star 数量 -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-200">Stars</label>
        <input
          v-model.number="form.stars"
          type="number"
          min="0"
          class="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
        />
      </div>

      <!-- 标签选择 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          标签
        </label>
        <!-- 分类标签列表 -->
        <div class="space-y-4">
          <div v-for="category in tagCategories" :key="category.name" class="space-y-2">
            <h3 class="text-sm font-medium text-gray-400">{{ category.name }}</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in category.tags"
                :key="tag.id"
                type="button"
                @click="toggleTag(tag.id)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  isTagSelected(tag.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                ]"
              >
                {{ tag.name }}
                <span v-if="isTagSelected(tag.id)" class="ml-1">✓</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 图片上传 -->
      <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">
          项目截图
        </label>
        <div class="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            multiple
            @change="handleImageUpload"
            class="hidden"
            ref="fileInput"
          />
          <button
            type="button"
            @click="fileInput?.click()"
            :disabled="loading"
            class="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 disabled:opacity-50"
          >
            {{ loading ? '处理中...' : '选择图片' }}
          </button>
          <span class="text-sm text-gray-400">
            支持多张图片上传（每张不超过10MB）
          </span>
        </div>
        <div v-if="error" class="mt-2 text-red-500 text-sm">
          {{ error }}
        </div>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div
            v-for="(image, index) in form.images"
            :key="index"
            class="relative group"
          >
            <img
              :src="image.url"
              :alt="form.name"
              class="w-full aspect-video object-cover rounded-lg"
            />
            <button
              type="button"
              @click="removeImage(index)"
              class="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 错误提示 -->
      <div v-if="error" class="text-red-500 text-sm">
        {{ error }}
      </div>

      <!-- 提交按钮 -->
      <div class="flex justify-end gap-4">
        <button
          type="button"
          @click="router.push('/admin/projects')"
          class="px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {{ loading ? '保存中...' : (isEdit ? '保存' : '创建') }}
        </button>
      </div>
    </form>
  </div>
</template>

<style>
/* Markdown 编辑器容器样式 */
.markdown-editor-container {
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid #4B5563;
}

/* 编辑器基础样式 */
.markdown-editor {
  min-height: 400px;
}

/* 编辑器主题样式 */
:deep(.bytemd) {
  background-color: #1F2937;
  color: #E5E7EB;
}

/* 工具栏样式 */
:deep(.bytemd-toolbar) {
  background-color: #374151;
  border-bottom: 1px solid #4B5563;
  padding: 0.5rem;
}

:deep(.bytemd-toolbar-icon) {
  color: #E5E7EB;
  margin: 0 0.25rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
}

:deep(.bytemd-toolbar-icon:hover) {
  background-color: #4B5563;
  color: #fff;
}

/* 编辑区域样式 */
:deep(.bytemd-editor) {
  background-color: #1F2937;
  color: #E5E7EB;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}

:deep(.CodeMirror) {
  background-color: #1F2937 !important;
  color: #E5E7EB !important;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  line-height: 1.6;
  padding: 1rem;
}

:deep(.CodeMirror-lines) {
  padding: 0.5rem 0;
}

:deep(.CodeMirror-line) {
  padding: 0 1rem;
}

:deep(.CodeMirror-cursor) {
  border-left: 1px solid #E5E7EB !important;
}

:deep(.CodeMirror-selected) {
  background: #4B5563 !important;
}

/* 预览区域样式 */
:deep(.bytemd-preview) {
  background-color: #1F2937;
  color: #E5E7EB;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.7;
}

:deep(.markdown-body) {
  background-color: transparent !important;
  color: #E5E7EB !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Markdown 预览样式 */
:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  color: #E5E7EB !important;
  border-bottom: 1px solid #4B5563;
  padding-bottom: 0.3em;
  margin-top: 1.5em;
  margin-bottom: 1em;
}

:deep(.markdown-body p) {
  margin: 1em 0;
  line-height: 1.75;
}

:deep(.markdown-body code) {
  background-color: #374151 !important;
  color: #E5E7EB !important;
  padding: 0.2em 0.4em;
  border-radius: 0.3em;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
}

:deep(.markdown-body pre) {
  background-color: #2D3748 !important;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  overflow-x: auto;
}

:deep(.markdown-body pre code) {
  background-color: transparent !important;
  padding: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

:deep(.markdown-body blockquote) {
  color: #9CA3AF !important;
  border-left: 0.25em solid #4B5563;
  padding: 0 1em;
  margin: 1em 0;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) {
  padding-left: 2em;
  margin: 1em 0;
}

:deep(.markdown-body li) {
  margin: 0.5em 0;
}

:deep(.markdown-body a) {
  color: #60A5FA !important;
  text-decoration: none;
}

:deep(.markdown-body a:hover) {
  text-decoration: underline;
}

:deep(.markdown-body hr) {
  height: 1px;
  background-color: #4B5563;
  border: none;
  margin: 2em 0;
}

/* 分隔线样式 */
:deep(.bytemd-split) {
  border-color: #4B5563;
}

/* 占位符文本样式 */
:deep(.CodeMirror-placeholder) {
  color: #6B7280 !important;
}
</style> 