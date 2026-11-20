// Name: Dilara Işık
// Student ID: 2023502033
// MIS 233 - Assignment 3


import type { Filter } from './filter'

export type Status = 'todo' | 'in-progress' | 'done'

export type Task = {
  id: string
  title: string
  status: Status
}

export type State = {
  tasks: Task[]
  filter: Filter
  past: Task[][]
}

export const initialState: State = {
  tasks: [],
  filter: 'all',
  past: [],
}

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'clearDone' }
  | { type: 'undo' }

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

function saveTasks(state: State, tasks: Task[]): State {
  return {
    ...state,
    tasks,
    past: [...state.past, state.tasks],
  }
}

export function taskReducer(
  state: State,
  action: Action,
): State {
  switch (action.type) {
    case 'add': {
      const newTask: Task = {
        id: action.id,
        title: action.title,
        status: 'todo',
      }

      return saveTasks(state, [...state.tasks, newTask])
    }

    case 'advance': {
      if (!state.tasks.some((task) => task.id === action.id)) {
        return state
      }

      const tasks = state.tasks.map((task) =>
        task.id === action.id
          ? { ...task, status: NEXT[task.status] }
          : task,
      )

      return saveTasks(state, tasks)
    }

    case 'remove': {
      const tasks = state.tasks.filter(
        (task) => task.id !== action.id,
      )

      if (tasks.length === state.tasks.length) {
        return state
      }

      return saveTasks(state, tasks)
    }

    case 'setFilter':
      return { ...state, filter: action.filter }

    case 'clearDone': {
      const tasks = state.tasks.filter(
        (task) => task.status !== 'done',
      )

      if (tasks.length === state.tasks.length) {
        return state
      }

      return saveTasks(state, tasks)
    }

    case 'undo': {
      if (state.past.length === 0) {
        return state
      }

      const previousTasks = state.past[state.past.length - 1]

      return {
        ...state,
        tasks: previousTasks,
        past: state.past.slice(0, -1),
      }
    }

    default: {
      const exhaustiveCheck: never = action
      return exhaustiveCheck
    }
  }
}
