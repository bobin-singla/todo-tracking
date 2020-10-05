export class TaskManagerModel {
    tasks: Task[];
}

export class Task {
    id: number;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    taskType: string;

    constructor(
        id: number,
        title: string,
        description: string,
        priority: string,
        dueDate: string,
        taskType: string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.dueDate = dueDate;
        this.taskType = taskType;
    }
}
