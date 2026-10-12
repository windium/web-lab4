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
