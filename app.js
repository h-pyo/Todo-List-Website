let todos;
let categories;
let noActive = true;

function findCurrentCategory() {
  const category = document.getElementById('active-list').innerText;
  return category.toString();
}

//------------------------------------------------------------
//----------------------Tasks Section-------------------------
//------------------------------------------------------------
const savedTodos = JSON.parse(localStorage.getItem('todos'));
if (Array.isArray(savedTodos)) {
      todos = savedTodos;
} else {
  todos = [{
    category: 'Youtube',
    list: [{
      task: 'record video',
      date: '2023-10-4',
      id: '1'
    }, {
      task: 'edit video',
      date: '2023-4-10',
      id: '2'
      }
    ]
  }];
}
    
function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function addTask(category, newTask, date) {
  todos.forEach(function (section) {
    if (section.category === category) {
      const id = new Date().getTime().toString();
      section.list.push({
        task: newTask.value,
        date: date.value,
        id: id
      });
    }
  });
  renderTasks(category);
  saveTodos();
}

function removeTask(event) {
  idToDelete = event.target.id;
  const category = findCurrentCategory();
  todos.forEach(function (section) {
    if (section.category === category) {
      section.list = section.list.filter(function (task) {
        if (task.id == idToDelete) {
          return false;
        } else {
          return true;
        }
      });
    }
  });
  renderTasks(category);
  saveTodos();
}

function renderTasks(category) {
  document.getElementById('tasks').innerHTML = '';
  todos.forEach(function (section) {
    let count = section.list.length;
    let index = 1;
    if (section.category == category) {
      //In the case where there are no tasks in the selected list
      if (count == 0) {
        document.getElementById('todo-list-title').innerText = section.category;
        document.getElementById('todo-list-task-count').innerText = 'All Done!!';
      }
      section.list.forEach(function (task) {
        const element = document.createElement('div');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'task-' + index;

        const b = document.createElement('button');
        b.className = 'remove-task-button';
        b.innerText = 'Delete Task'
        b.id = task.id;
        b.setAttribute("onclick", "removeTask(event)");

        const text = document.createElement('label');
        text.htmlFor = checkbox.id;
        text.innerText = task.task + " - " + '(' + task.date + ')';

        text.appendChild(b);
        element.appendChild(checkbox);
        element.appendChild(text);
        document.getElementById('tasks').appendChild(element);
        index++;
        if (count === 0) {
          document.getElementById('todo-list-task-count').innerText = 'All Done!!';
        } else {
          document.getElementById('todo-list-task-count').innerText = count + ' tasks remaining';
        }
        document.getElementById('todo-list-title').innerText = section.category;
      });
    }
  });
}

function renderEmptyTasks() {
  document.getElementById('todo-list-title').innerText = '------';
  document.getElementById('todo-list-task-count').innerText = 'None';
  document.getElementById('tasks').innerHTML = '';
}

//------------------------------------------------------------
//--------------------categories Section---------------------- 
//------------------------------------------------------------
const savedcategories = JSON.parse(localStorage.getItem('categories'));
if (Array.isArray(savedcategories)) {
      categories = savedcategories;
} else {
  categories = [{
    title: 'Youtube'
  }];
}

function saveCategory() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

function addCategory(newList) {
  let contains = false;
  categories.forEach(function (category) {
    if (category.title == newList.value) {
      contains = true;
    }
  });
  if (contains) {
    alert('This list already exists!!');
  } else {
    categories.push({
    title: newList.value,
    });
    todos.push({
      category: newList.value,
      list: []
    });
    if (categories.length === 1) {
      firstCatagoriesRender();
      renderTasks(categories[0].title);
    } else {
      renderCategories();
    }
    saveCategory();
    saveTodos();
  }
}

function deleteCategory(category) {
  categories = categories.filter(function (section) {
    if (section.title === category) {
      return false;
    } else {
      return true;
    }
  });

  todos.forEach(function (section) {
    if (section.category === category) {
      todos = todos.filter(function (list) {
        if (list.category === category) {
          return false;
        } else {
          return true;
        }
      });
    }
  }); 
  firstCatagoriesRender();

  if (categories.length === 0) {
    renderEmptyTasks();
  } else {
    renderTasks(findCurrentCategory());
  }
  saveCategory();
  saveTodos();
}


function renderCategories() {
  const current = findCurrentCategory();
  document.getElementById('list-categories').innerHTML = '';
  categories.forEach(function (category) {
    const element = document.createElement('li');
    element.innerText = category.title;
    if (category.title === current) {
      element.setAttribute('id', 'active-list');
    }
    element.className = 'list-name';
    element.setAttribute("onclick", "swapLists(event)");
    document.getElementById('list-categories').appendChild(element);
  });
  if (noActive) {
    const list = document.querySelectorAll('li');
    list[0].setAttribute('id', 'active-list');
    noActive = false;
  }
}

function firstCatagoriesRender() {
  document.getElementById('list-categories').innerHTML = '';
  let count = 0;
  categories.forEach(function (category) {
    const element = document.createElement('li');
    element.innerText = category.title;
    if (count === 0) {
      element.setAttribute('id', 'active-list');
    }
    element.className = 'list-name';
    element.setAttribute("onclick", "swapLists(event)");
    document.getElementById('list-categories').appendChild(element);
    count++;
  });
}

//-----------------Switch Category List----------------------
function swapLists(event) {
  const current = findCurrentCategory();
  const categoryToSwitchTo = event.target.innerText;
  const lists = document.querySelectorAll('.list-name');
  for (let i = 0; i < lists.length; i++) {
    if (lists[i].innerText === current) {
      lists[i].removeAttribute('id');
    }
    if (lists[i].innerText === categoryToSwitchTo) {
      lists[i].setAttribute('id', 'active-list');
    }
  }
  renderCategories();
  renderTasks(categoryToSwitchTo);
}
firstCatagoriesRender();
renderTasks(findCurrentCategory());