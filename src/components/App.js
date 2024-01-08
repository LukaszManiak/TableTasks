import { useReducer, useState } from "react";

const initialState = {
  // table todos
  todoTasks: [],
  inProgress: [],
  doneTasks: [],
  //newTaskForm
  newTaskForm: false,
  //inputs
};

function reducer(state, action) {
  switch (action.type) {
    case "newTaskForm":
      return { ...state, newTaskForm: !state.newTaskForm };
    // add task
    case "addTask":
      const actionType = action.payload.type;
      if (actionType === "todo") {
        return {
          ...state,
          todoTasks: [...state.todoTasks, action.payload],
        };
      } else if (actionType === "inprogress") {
        return {
          ...state,
          inProgress: [...state.inProgress, action.payload],
        };
      } else if (actionType === "done") {
        return {
          ...state,
          doneTasks: [...state.doneTasks, action.payload],
        };
      } else {
        return state;
      }
    default:
      throw new Error("Unkown");
  }
}

function App() {
  const [{ todoTasks, inProgress, doneTasks, newTaskForm }, dispatch] =
    useReducer(reducer, initialState);

  return (
    <div className="app">
      <NavBar dispatch={dispatch} />
      <AllTables />
      <Table
        todoTasks={todoTasks}
        inProgress={inProgress}
        doneTasks={doneTasks}
      />
      {newTaskForm && <AddNewTask dispatch={dispatch} />}
    </div>
  );
}

function NavBar({ dispatch }) {
  return (
    <nav className="navBar">
      <h2>TableTasks</h2>
      <button
        onClick={() => dispatch({ type: "newTaskForm" })}
        className="addTask"
      >
        +Add New Task
      </button>
    </nav>
  );
}

function AllTables() {
  return (
    <div className="allTables">
      <p>ALL TABLES (3)</p>
      <ul>
        <li>Store website</li>
        <li>Rebuild project</li>
        <li>Launch steps</li>
      </ul>
      <button>+Add New Table</button>
    </div>
  );
}

function Table({ todoTasks, inProgress, doneTasks }) {
  return (
    <div className="table">
      <h2>Store website</h2>
      <div>
        <div>TODO (3)</div>
        {todoTasks.map((task, i) => (
          <TableItem title={task.title} key={i} />
        ))}
      </div>
      <div>
        <div>IN PROGRESS (6)</div>
        {inProgress.map((task, i) => (
          <TableItem title={task.title} key={i} />
        ))}
      </div>
      <div>
        <div>DONE (9)</div>
        {doneTasks.map((task, i) => (
          <TableItem title={task.title} key={i} />
        ))}
      </div>
    </div>
  );
}

function TableItem({ title, dispatch, tasks }) {
  return (
    <div className="taskBox">
      <p>{title}</p>
      {/* <p>0 of 3 done</p> */}
    </div>
  );
}

function TaskBox({ title, description }) {
  return (
    <div className="taskBox">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  );
}

// add new task modal
function AddNewTask({ dispatch }) {
  // task state
  const [task, setTask] = useState({
    title: "",
    description: "",
    type: "",
    id: Math,
  });

  // handling task inputs clear
  function handleTaskClear() {
    // add
    dispatch({ type: "addTask", payload: task });
    setTask({
      title: "",
      description: "",
      type: "",
      id: Math,
    });
    dispatch({ type: "newTaskForm" });
  }

  // console.log(task);
  return (
    <div className={"addNewTaskModal"}>
      <h3>Add New Task</h3>
      <label>Title</label>
      <input
        placeholder="Platform setup"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <label>Description</label>
      <input
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <select
        value={task.type}
        onChange={(e) => setTask({ ...task, type: e.target.value })}
      >
        <option value={""}>Select Option</option>
        <option value={"todo"}>Todo</option>
        <option value={"inprogress"}>In progress</option>
        <option value={"done"}>Done</option>
      </select>

      <button onClick={() => handleTaskClear()}>Add Task</button>
    </div>
  );
}

export default App;
