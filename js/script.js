'use strict';

class Todo {
	constructor(form, input, todoList, todoCompleted, todoContainer) {
		this.form = document.querySelector(form);
		this.input = document.querySelector(input);
		this.todoList = document.querySelector(todoList);
		this.todoCompleted = document.querySelector(todoCompleted);
		this.todoContainer = document.querySelector(todoContainer);
		this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
	}
	addToStorage() {
		localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
	}
	render() {
		this.todoList.textContent = '';
		this.todoCompleted.textContent = '';
		this.todoData.forEach(this.createItem, this);
		this.addToStorage();
	}
	createItem(value, key) {
		const li = document.createElement('li');
		li.classList.add('todo-item');
		li.dataset.key = key;
		if (value.completed) {
			this.todoCompleted.append(li);
		} else {
			this.todoList.append(li);
		}
		li.insertAdjacentHTML('beforeend', `
			<span class="text-todo">${value.value}</span>
			<div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>
		`);
	}
	addTodo(event) {
		event.preventDefault();
		if (this.input.value.trim()) {
			const newTodo = {
				value: this.input.value,
				completed: false,
				key: this.generateKey(),
			};
			this.todoData.set(newTodo.key, newTodo);
			this.render();
		} else {
			alert('Пустое дело добавить нельзя!');
		}
		this.input.value = '';
	}
	generateKey() {
		return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	}
	deletedItem(event) {
		this.todoData.delete(event.target.closest('.todo-item').dataset.key);
		this.render();
	}
	completedItem(event) {
		this.todoData.forEach((value, key) => {
			if (key === event.target.closest('.todo-item').dataset.key) {
				if (value.completed) {
					value.completed = false
				} else {
					value.completed = true;
				}
			}
		});

		this.render();
	}
	handler() {
		this.todoContainer.addEventListener('click', (event) => {
			const target = event.target;
			if (target.matches('.todo-remove')) {
				this.deletedItem(event);
			}
			if (target.matches('.todo-complete')) {
				this.completedItem(event);
			}
		});
	}
	init() {
		this.form.addEventListener('submit', this.addTodo.bind(this));
		this.render();
		this.handler();
	}
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();