
import { useReducer } from 'react'
import type { Dispatch } from 'react'
import {
  taskReducer,
  initialState,
  type Task,
  type Action,
} from './taskReducer'
import {
  FILTERS,
  filterTasks,
  countByFilter,
  type Filter,
} from './filter'
import TaskRow from './TaskRow'

type AppDispatch = Dispatch<Action>

function AddForm({ dispatch }: { dispatch: AppDispatch }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()

    if (title) {
      dispatch({
        type: 'add',
        id: crypto.randomUUID(),
        title,
      })
    }
  }

  return (
    <form action={addTask} style={{ display: 'flex', gap: 8 }}>
      <input
        name="title"
        placeholder="New task"
        aria-label="New task"
        required
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Add</button>
    </form>
  )
}

const LABELS: Record<Filter, string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

type FilterBarProps = {
  activeFilter: Filter
  counts: Record<Filter, number>
  dispatch: AppDispatch
}

function FilterBar({
  activeFilter,
  counts,
  dispatch,
}: FilterBarProps) {
  return (
    <nav
      aria-label="Task filters"
      style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        margin: '20px 0',
      }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter

        return (
          <button
            key={filter}
            type="button"
            aria-pressed={isActive}
            onClick={() =>
              dispatch({ type: 'setFilter', filter })
            }
            style={{
              padding: '8px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              border: '1px solid #2563eb',
              backgroundColor: isActive ? '#2563eb' : '#ffffff',
              color: isActive ? '#ffffff' : '#2563eb',
              fontWeight: isActive ? 'bold' : 'normal',
            }}
          >
            {LABELS[filter]} ({counts[filter]})
          </button>
        )
      })}
    </nav>
  )
}

type TaskListProps = {
  tasks: Task[]
  dispatch: AppDispatch
}

function TaskList({ tasks, dispatch }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks here.</p>
  }

  return (
    <ul style={{ paddingLeft: 20 }}>
      {tasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onNext={() =>
            dispatch({ type: 'advance', id: task.id })
          }
          onDelete={() =>
            dispatch({ type: 'remove', id: task.id })
          }
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(
    taskReducer,
    initialState,
  )

  const visibleTasks = filterTasks(
    state.tasks,
    state.filter,
  )

  const counts = countByFilter(state.tasks)

  return (
    <main
      style={{
        maxWidth: 750,
        margin: '40px auto',
        padding: 20,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Task Manager</h1>

      <AddForm dispatch={dispatch} />

      <FilterBar
        activeFilter={state.filter}
        counts={counts}
        dispatch={dispatch}
      />

      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <button
          type="button"
          onClick={() => dispatch({ type: 'clearDone' })}
          disabled={counts.done === 0}
        >
          Clear done
        </button>

        <button
          type="button"
          onClick={() => dispatch({ type: 'undo' })}
          disabled={state.past.length === 0}
        >
          Undo
        </button>
      </div>

      <TaskList
        tasks={visibleTasks}
        dispatch={dispatch}
      />
    </main>
  )
}
