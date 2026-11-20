
import { describe, it, expect } from 'vitest'
import { filterTasks, countByFilter } from './filter'
import type { Task } from './taskReducer'

const tasks: Task[] = [
  { id: '1', title: 'Write report', status: 'todo' },
  { id: '2', title: 'Study React', status: 'in-progress' },
  { id: '3', title: 'Submit homework', status: 'done' },
  { id: '4', title: 'Read slides', status: 'todo' },
]

describe('filterTasks', () => {
  it('returns all tasks when filter is all', () => {
    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only todo tasks', () => {
    const result = filterTasks(tasks, 'todo')
    expect(result).toHaveLength(2)
    expect(result.every((t) => t.status === 'todo')).toBe(true)
  })

  it('returns only in-progress tasks', () => {
    const result = filterTasks(tasks, 'in-progress')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Study React')
  })

  it('returns only done tasks', () => {
    const result = filterTasks(tasks, 'done')
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Submit homework')
  })

  it('returns an empty array when no tasks match', () => {
    expect(filterTasks([], 'done')).toEqual([])
  })

  it('does not mutate the original task list', () => {
    const before = structuredClone(tasks)
    filterTasks(tasks, 'todo')
    expect(tasks).toEqual(before)
  })
})

describe('countByFilter', () => {
  it('counts tasks correctly for every filter', () => {
    expect(countByFilter(tasks)).toEqual({
      all: 4,
      todo: 2,
      'in-progress': 1,
      done: 1,
    })
  })

  it('returns zero counts for an empty list', () => {
    expect(countByFilter([])).toEqual({
      all: 0,
      todo: 0,
      'in-progress': 0,
      done: 0,
    })
  })

  it('updates counts after a task is removed', () => {
    const remaining = tasks.filter((t) => t.id !== '3')

    expect(countByFilter(remaining)).toEqual({
      all: 3,
      todo: 2,
      'in-progress': 1,
      done: 0,
    })
  })
})

