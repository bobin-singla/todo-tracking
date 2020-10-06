import {Component, OnInit} from '@angular/core';
import {moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Task, TaskManagerModel} from './app.model';
import {AppService} from './app.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    addEditTaskForm: FormGroup;
    allTasks: Task[] = [];
    pending: Task[] = [];
    inProcess: Task[] = [];
    done: Task[] = [];
    showForm: boolean;

    constructor(private formBuilder: FormBuilder, private appService: AppService) {
        this.addEditTaskForm = this.formBuilder.group({
            id: [null],
            title: [''],
            description: [''],
            priority: [''],
            dueDate: [''],
            taskType: ['pending']
        });
    }

    ngOnInit() {
        this.updateLists();
    }

    updateLists() {
        this.allTasks = [];
        this.pending = [];
        this.inProcess = [];
        this.done = [];
        if (this.appService.getItem('tasks')) {
            this.allTasks = JSON.parse(this.appService.getItem('tasks')).tasks;
            for (let i = 0; i < this.allTasks.length; i++) {
                switch (this.allTasks[i].taskType) {
                    case 'pending':
                        this.pending.push(this.allTasks[i]);
                        break;
                    case 'inProcess':
                        this.inProcess.push(this.allTasks[i]);
                        break;
                    case 'done':
                        this.done.push(this.allTasks[i]);
                        break;
                }
            }
        }
    }

    drop(event) {
        const index = this.allTasks.findIndex(x => x.id === event.item.data.id);
        switch (event.container.id) {
            case 'cdk-drop-list-0':
                this.allTasks[index].taskType = 'pending';
                break;
            case 'cdk-drop-list-1':
                this.allTasks[index].taskType = 'inProcess';
                break;
            case 'cdk-drop-list-2':
                this.allTasks[index].taskType = 'done';
                break;
        }
        this.updateLocalStorage();
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
    }

    addTask() {
        if (this.addEditTaskForm.valid) {
            if (this.appService.getItem('tasks')) {
                this.allTasks = JSON.parse(this.appService.getItem('tasks')).tasks;
            }
            console.log(this.addEditTaskForm.value.id);
            const addTaskValues = new Task(
                this.addEditTaskForm.value.id ? this.addEditTaskForm.value.id : Date.now(),
                this.addEditTaskForm.value.title,
                this.addEditTaskForm.value.description,
                this.addEditTaskForm.value.priority,
                this.addEditTaskForm.value.dueDate,
                this.addEditTaskForm.value.taskType ? this.addEditTaskForm.value.taskType : 'pending',
            );
            if (this.addEditTaskForm.value.id || this.addEditTaskForm.value.id === 0) {
                const index = this.allTasks.findIndex(x => x.id === this.addEditTaskForm.value.id);
                this.allTasks[index] = addTaskValues;
            } else {
                this.allTasks.push(addTaskValues);
            }
            this.showForm = false;
            this.addEditTaskForm.reset();
            this.updateLocalStorage();
        }
    }

    updateLocalStorage() {
        const taskManager = new TaskManagerModel();
        taskManager.tasks = this.allTasks;
        this.appService.setItem('tasks', JSON.stringify(taskManager));
        this.updateLists();
    }

    editTask(task: Task) {
        this.showForm = true;
        this.addEditTaskForm.setValue({
            id: task.id,
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate,
            taskType: task.taskType
        });
    }

    openAddTaskForm() {
        this.showForm = true;
    }

    closeForm() {
        this.showForm = false;
        this.addEditTaskForm.reset();
    }

    getBackgroundColor() {
        const value = (this.done.length * 100) / this.allTasks.length;
        if (value <= 33) {
            return 'red';
        } else if (value > 33 && value < 66) {
            return 'blue';
        } else {
            return 'green';
        }
    }

    deleteTask(task: Task) {
        if (this.appService.getItem('tasks')) {
            this.allTasks = JSON.parse(this.appService.getItem('tasks')).tasks;
        }
        const index = this.allTasks.findIndex(x => x.id === task.id);
        this.allTasks.splice(index, 1);
        console.log(this.allTasks);
        this.updateLocalStorage();
    }
}
