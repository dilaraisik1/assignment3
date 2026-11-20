
import { describe, it, expect } from 'vitest'
import {
  taskReducer,
  initialState,
  type State,
} from './taskReducer'

const baseState: State = {
  tasks: [
    { id: '1', title: 'Write report', status: 'todo' },
    { id: '2', title: 'Study React', status: 'in-progress' },
    { id: '3', title: 'Submit homework', status: 'done' },
  ],
  filter: 'all',
  past: [],
}

describe('taskReducer', () => {
  it('starts with an empty task list and all filter', () => {
    expect(initialState).toEqual({
      tasks: [],
      filter: 'all',
      past: [],
    })
  })

  it('adds a new task with todo status', () => {
    const result = taskReducer(initialState, {
      type: 'add',
      id: '4',
      title: 'New task',
    })

    expect(result.tasks).toEqual([
      { id: '4', title: 'New task', status: 'todo' },
    ])
    expect(result.past).toHaveLength(1)
  })

  it('advances todo to in-progress', () => {
    const result = taskReducer(baseState, {
      type: 'advance',
      id: '1',
    })

    expect(result.tasks[0].status).toBe('in-progress')
  })

  it('advances in-progress to done', () => {
    const result = taskReducer(baseState, {
      type: 'advance',
      id: '2',
    })

    expect(result.tasks[1].status).toBe('done')
  })

  it('advances done back to todo', () => {
    const result = taskReducer(baseState, {
      type: 'advance',
      id: '3',
    })

    expect(result.tasks[2].status).toBe('todo')
  })

  it('returns to todo after three advances', () => {
    let state = taskReducer(baseState, {
      type: 'advance',
      id: '1',
    })

    state = taskReducer(state, {
      type: 'advance',
      id: '1',
    })

    state = taskReducer(state, {
      type: 'advance',
      id: '1',
    })

    expect(state.tasks[0].status).toBe('todo')
  })

  it('removes the selected task', () => {
    const result = taskReducer(baseState, {
      type: 'remove',
      id: '2',
    })

    expect(result.tasks).toHaveLength(2)
    expect(result.tasks.some((t) => t.id === '2')).toBe(false)
  })

  it('changes the filter without changing tasks', () => {
    const result = taskReducer(baseState, {
      type: 'setFilter',
      filter: 'done',
    })

    expect(result.filter).toBe('done')
    expect(result.tasks).toEqual(baseState.tasks)
    expect(result.past).toHaveLength(0)
  })

  it('clears all done tasks', () => {
    const result = taskReducer(baseState, {
      type: 'clearDone',
    })

    expect(result.tasks).toHaveLength(2)
    expect(result.tasks.every((t) => t.status !== 'done')).toBe(true)
  })

  it('keeps the filter when clearing done tasks', () => {
    const state: State = { ...baseState, filter: 'done' }

    const result = taskReducer(state, {
      type: 'clearDone',
    })

    expect(result.filter).toBe('done')
  })

  it('undoes adding a task', () => {
    const added = taskReducer(initialState, {
      type: 'add',
      id: '1',
      title: 'Test',
    })

    const undone = taskReducer(added, {
      type: 'undo',
    })

    expect(undone.tasks).toEqual([])
    expect(undone.past).toHaveLength(0)
  })

  it('undoes advancing a task', () => {
    const advanced = taskReducer(baseState, {
      type: 'advance',
      id: '1',
    })

    const undone = taskReducer(advanced, {
      type: 'undo',
    })

    expect(undone.tasks[0].status).toBe('todo')
  })

  it('undoes removing a task', () => {
    const removed = taskReducer(baseState, {
      type: 'remove',
      id: '2',
    })

    const undone = taskReducer(removed, {
      type: 'undo',
    })

    expect(undone.tasks).toEqual(baseState.tasks)
  })

  it('undoes clearDone and restores completed tasks', () => {
    const cleared = taskReducer(baseState, {
      type: 'clearDone',
    })

    const undone = taskReducer(cleared, {
      type: 'undo',
    })

    expect(undone.tasks).toEqual(baseState.tasks)
  })

  it('does not undo filter changes', () => {
    const result = taskReducer(baseState, {
      type: 'setFilter',
      filter: 'todo',
    })

    expect(result.past).toHaveLength(0)
    expect(taskReducer(result, { type: 'undo' })).toBe(result)
  })

  it('keeps the current filter when undoing task changes', () => {
    const removed = taskReducer(baseState, {
      type: 'remove',
      id: '1',
    })

    const filtered = taskReducer(removed, {
      type: 'setFilter',
      filter: 'done',
    })

    const undone = taskReducer(filtered, {
      type: 'undo',
    })

    expect(undone.filter).toBe('done')
    expect(undone.tasks).toEqual(baseState.tasks)
  })

  it('does nothing when undo history is empty', () => {
    const result = taskReducer(initialState, {
      type: 'undo',
    })

    expect(result).toBe(initialState)
  })

  it('does nothing when an unknown id is advanced', () => {
    const result = taskReducer(baseState, {
      type: 'advance',
      id: 'unknown',
    })

    expect(result).toBe(baseState)
  })

  it('does nothing when an unknown id is removed', () => {
    const result = taskReducer(baseState, {
      type: 'remove',
      id: 'unknown',
    })

    expect(result).toBe(baseState)
  })

  it('does not add undo history when nothing is done', () => {
    const state: State = {
      tasks: [
        { id: '1', title: 'Task', status: 'todo' },
      ],
      filter: 'all',
      past: [],
    }

    const result = taskReducer(state, {
      type: 'clearDone',
    })

    expect(result).toBe(state)
  })

  it('does not mutate the original state', () => {
    const original = structuredClone(baseState)

    const result = taskReducer(baseState, {
      type: 'advance',
      id: '1',
    })

    expect(baseState).toEqual(original)
    expect(result).not.toBe(baseState)
    expect(result.tasks).not.toBe(baseState.tasks)
    expect(result.tasks[0]).not.toBe(baseState.tasks[0])
  })

  it('supports multiple undo operations', () => {
    const first = taskReducer(initialState, {
      type: 'add',
      id: '1',
      title: 'First task',
    })

    const second = taskReducer(first, {
      type: 'add',
      id: '2',
      title: 'Second task',
    })

    const undoOnce = taskReducer(second, {
      type: 'undo',
    })

    const undoTwice = taskReducer(undoOnce, {
      type: 'undo',
    })

    expect(undoOnce.tasks).toHaveLength(1)
    expect(undoTwice.tasks).toHaveLength(0)
    expect(undoTwice.past).toHaveLength(0)
  })
})
