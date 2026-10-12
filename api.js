// Simulates a server request that answers after 1.5 seconds.
// Pass shouldFail = true to try out the error path.
function fetchTasks(shouldFail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Server did not respond"));
        return;
      }

      resolve([
        { id: 1, title: "Study JavaScript", completed: false },
        { id: 2, title: "Practice DOM", completed: true },
        { id: 3, title: "Read Async Patterns", completed: false },
      ]);
    }, 1500);
  });
}
