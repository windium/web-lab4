# Assignment 4 – Dynamic Task Dashboard

A small task dashboard built with vanilla JavaScript. Tasks are loaded from a
simulated server, rendered with DOM methods, and can be toggled or deleted.
All state updates are immutable.

## How to run

Open `index.html` in a browser and click **Load Tasks**. No build step or
server is needed.

## File organization

```
/assignment4
 ├── index.html      Page structure: heading, Load Tasks button, status message, task list container
 ├── styles.css      Minimal styling; .completed tasks get a line-through
 ├── taskManager.js  Task and TaskManager classes (state and immutable updates)
 ├── api.js          fetchTasks(): a Promise that resolves after 1500ms with the raw task data
 └── main.js         Connects everything: button click, async loading, JSON round-trip, rendering, events
```

Scripts are loaded in dependency order with `defer` (`api.js`, then
`taskManager.js`, then `main.js`), so the page works when opened straight from
the file system.

### taskManager.js

- `Task` sets its `id` with `Object.defineProperty` (`writable: false`,
  `configurable: false`), so it can't be changed after creation.
  `toggle()` returns a new `Task` with the opposite `completed` value.
- `TaskManager` never changes its `tasks` array in place. `setTasks`,
  `addTask`, `removeTask` and `toggleTask` each build a new array (spread,
  `filter`, `map`) and assign it. The array is also frozen with
  `Object.freeze`, so an accidental `push` throws an error.

### main.js

1. Clicking **Load Tasks** shows "Loading tasks..." and disables the button.
2. `await fetchTasks()` gets the raw data.
3. The data goes through `JSON.stringify` and then `JSON.parse`, and the parsed
   objects become `Task` instances.
4. The tasks are stored in the `TaskManager` and rendered, and the status
   message is cleared.
5. Any error is caught with `try/catch` and shown in `#statusMessage`.

Each task is a `div.task` with a `span` for the title and **Toggle** /
**Delete** buttons. Every button gets its own `addEventListener`. No inline
handlers or `innerHTML` are used.

## Challenges

- **Read-only id inside a class.** A normal `this.id = id` can be overwritten,
  so the id had to be set with `Object.defineProperty`. Writing to it fails
  silently in non-strict code and throws a `TypeError` in strict mode, which
  made the bug easy to miss at first.
- **Keeping updates immutable.** Methods like `push` and `splice` are
  convenient but change the original array. I had to rely on spread, `filter`
  and `map`, and toggling a task means replacing it with a new `Task` object
  instead of flipping a property. Freezing the array helped catch mistakes.
- **Re-rendering after events.** Every Toggle or Delete click re-draws the
  whole list from the current state, so each button's listener has to be
  attached again whenever its element is created. Clearing the old elements
  first prevents duplicates.
- **Scripts without modules.** Opening the page from `file://` blocks ES
  module imports in most browsers, so I used ordinary `<script defer>` tags
  in the correct order instead.
- **Testing the error path.** The real fetch always succeeds, so
  `fetchTasks(true)` can simulate a failure to check that the `catch` block
  shows the error message.
