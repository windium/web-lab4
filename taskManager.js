class Task {
  constructor(id, title, completed) {
    // id is fixed for the lifetime of the task: not writable, not reconfigurable
    Object.defineProperty(this, "id", {
      value: id,
      writable: false,
      enumerable: true,
      configurable: false,
    });
    this.title = title;
    this.completed = completed;
  }

  // Returns a new Task instead of changing this one
  toggle() {
    return new Task(this.id, this.title, !this.completed);
  }
}

// Every method builds a new array and swaps it in; the old array is never
// changed. Arrays are frozen so an accidental push/splice throws in strict mode.
class TaskManager {
  constructor() {
    this.tasks = Object.freeze([]);
  }

  setTasks(tasks) {
    this.tasks = Object.freeze([...tasks]);
  }

  addTask(task) {
    this.tasks = Object.freeze([...this.tasks, task]);
  }

  removeTask(taskId) {
    this.tasks = Object.freeze(this.tasks.filter((task) => task.id !== taskId));
  }

  toggleTask(taskId) {
    this.tasks = Object.freeze(
      this.tasks.map((task) => (task.id === taskId ? task.toggle() : task))
    );
  }
}
