const THEME_KEY = 'tasks_demo_theme';

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const statusText = document.getElementById('status');
const themeToggle = document.getElementById('theme-toggle');
const submitBtn = document.getElementById('submit-btn');

let pendingRequests = 0;
let isCreating = false;

function setStatus(message, type = 'info') {
  statusText.textContent = message;
  statusText.dataset.type = type;
}

function updateBusyState() {
  const busy = pendingRequests > 0;
  taskInput.disabled = busy;
  submitBtn.disabled = busy || !taskInput.value.trim();
  themeToggle.disabled = busy;

  const deleteButtons = taskList.querySelectorAll('button[data-action="delete"]');
  deleteButtons.forEach((btn) => {
    btn.disabled = busy;
  });
}

function beginRequest(message) {
  pendingRequests += 1;
  if (message) {
    setStatus(message, 'loading');
  }
  updateBusyState();
}

function endRequest() {
  pendingRequests = Math.max(0, pendingRequests - 1);
  updateBusyState();
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);
}

function renderTasks(tasks) {
  taskList.innerHTML = '';

  if (!tasks.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = '当前没有任务，输入内容后按回车即可创建。';
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'task-item';

    const title = document.createElement('span');
    title.textContent = task.title;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.dataset.action = 'delete';
    delBtn.textContent = '删除';
    delBtn.addEventListener('click', async () => {
      beginRequest('正在删除任务...');
      try {
        await request(`/api/tasks/${encodeURIComponent(task.id)}`, {
          method: 'DELETE'
        });
        await loadTasks();
        setStatus('任务已删除', 'success');
      } catch (error) {
        setStatus(error.message || '删除失败，请稍后重试', 'error');
      } finally {
        endRequest();
      }
    });

    item.appendChild(title);
    item.appendChild(delBtn);
    taskList.appendChild(item);
  });
}

async function request(url, options) {
  const response = await fetch(url, options);
  let payload = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    throw new Error((payload && payload.error) || '请求失败');
  }

  return payload;
}

async function loadTasks() {
  const data = await request('/api/tasks');
  renderTasks(data.tasks || []);
}

async function createTask(title) {
  await request('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title })
  });
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isCreating) {
    return;
  }

  const title = taskInput.value.trim();
  if (!title) {
    setStatus('请输入任务内容', 'error');
    return;
  }

  isCreating = true;
  beginRequest('正在创建任务...');
  try {
    await createTask(title);
    taskInput.value = '';
    await loadTasks();
    setStatus('任务已新增', 'success');
  } catch (error) {
    setStatus(error.message || '新增失败，请稍后重试', 'error');
  } finally {
    isCreating = false;
    endRequest();
  }
});

taskInput.addEventListener('input', () => {
  updateBusyState();
});

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
    event.preventDefault();
    taskForm.requestSubmit();
  }
});

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  setStatus(`当前主题：${next}`, 'success');
});

async function bootstrap() {
  initTheme();
  beginRequest('正在加载任务...');
  try {
    await loadTasks();
    setStatus('任务已加载', 'info');
  } finally {
    endRequest();
  }
}

bootstrap().catch((error) => {
  setStatus(error.message || '加载失败', 'error');
});
