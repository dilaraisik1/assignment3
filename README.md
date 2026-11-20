
# MIS 233 – Assignment 3: Task Manager with a Reducer

**Name:** Dilara Işık  
**Student ID:** 2023520833

## Project Description

This project is a Task Manager application developed using React, TypeScript, and Vite.

The application uses React's useReducer hook to manage tasks and the selected status filter. Users can add tasks, change their status, delete tasks, and filter the list by status.

Each task has one of three statuses: todo, in-progress, or done. Clicking Next changes the status in this order:

todo → in-progress → done → todo

The application also displays live task counts for each filter and includes a Clear done button.

## How to Run

Requires Node.js 20.19 or newer.

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Check the production build:

```bash
npm run build
```

Run the automated tests:

```bash
npm test
```

## Project Structure

- `src/taskReducer.ts`: State, actions, reducer, and undo history.
- `src/filter.ts`: Task filtering and status counting functions.
- `src/App.tsx`: Main application, useReducer, forms, and filter buttons.
- `src/TaskRow.tsx`: Individual task row with Next and Delete buttons.
- `src/taskReducer.test.ts`: Reducer and undo tests.
- `src/filter.test.ts`: Filtering and counting tests.
- `screenshots/`: Four screenshots demonstrating each filter.

## Requirements Implemented

R1: State object with tasks and filter, managed by useReducer.

R2: Add, advance, remove, setFilter, and clearDone actions.

R3: Pure reducer, immutable state updates, and exhaustive switch.

R4: Pure filterTasks and countByFilter functions.

R5: Four filter buttons with an active-filter indicator.

R6: Live task counts, filtered lists, and empty-list messages.

R7: Strict TypeScript build passes without errors or any types.

## Bonus 1: Undo

The application includes an Undo button that restores the task list before the most recent task-changing action.

The state contains tasks, filter, and past, where past is an array of previous task lists (Task[][]). Whenever a task-changing action occurs, the reducer saves the previous list in past, allowing Undo to restore it without changing the selected filter.

Filter changes are not stored in the undo history. The Undo button is disabled when there are no previous task lists.

## Bonus 2: Tests

I implemented automated tests using Vitest to verify the reducer and filtering functions.

The tests cover adding, advancing, removing, filtering, clearing completed tasks, and undoing changes. They also check immutability and edge cases, including unknown task IDs, empty lists, and multiple undo operations.

Test results:

```text
src/filter.test.ts       (9 tests)
src/taskReducer.test.ts  (22 tests)

Test Files  2 passed (2)
Tests       31 passed (31)
```

All 31 automated tests passed successfully.

The project also passes `npm run build`.

## Bonus 3: Explain your reducer

A reducer should be a pure function because its output should depend only on the current state and the action it receives. It should not modify existing objects or arrays. This is especially important in React because React uses state references to determine when updates occur. If I directly modify the existing state instead of returning a new object, React may not recognize the change correctly, which can cause the interface to display outdated information. Pure functions also make testing easier because the same inputs always produce the same outputs.

I generate task IDs outside the reducer using crypto.randomUUID() in the AddForm component. This keeps the reducer predictable. If the reducer generated random IDs itself, processing the same action with the same state could produce different results. Keeping random operations outside the reducer also makes automated tests more reliable.

I calculate the filtered task list and status counts directly from the current state during rendering. These are derived values, so storing them separately would create unnecessary duplication. For example, if I deleted a completed task but forgot to update a separate count state, the Done button could display an incorrect number. Calculating counts from the tasks array prevents this problem.

Moving the filter into the reducer state makes the application easier to organize because task-related changes and filter changes are handled in one place. However, it also makes the State type and reducer slightly more complex. Overall, I find this approach useful because the update logic stays centralized and easier to follow.

## Bonus 4: Git repository

Repository link: ADD_YOUR_GITHUB_REPOSITORY_LINK_HERE

The project is version-controlled with Git. Its history contains separate commits documenting the implementation steps.

The repository includes the source files, tests, README, and four screenshots. The .gitignore file excludes node_modules and build output.

## Screenshots

The screenshots demonstrate the task list under each filter:

- `screenshots/all.png`
- `screenshots/todo.png`
- `screenshots/in-progress.png`
- `screenshots/done.png`

Each screenshot shows the filter buttons, live counts, and the corresponding visible tasks.
