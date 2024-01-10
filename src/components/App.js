import { useEffect, useReducer, useState } from "react";
import Button from "./Button";

const initialState = {
  tables: [],
  selectedTable: null,
  // table todos
  todoTasks: [],
  inProgress: [],
  doneTasks: [],
  //newTaskForm
  newTaskForm: false,
  newTableForm: false,
  //inputs
};

function reducer(state, action) {
  switch (action.type) {
    case "newTaskForm":
      return { ...state, newTaskForm: !state.newTaskForm };
    case "newTableForm":
      return { ...state, newTableForm: !state.newTableForm };
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
    // add table
    case "addTable":
      if (action.payload.title === "") return state;
      return { ...state, tables: [...state.tables, action.payload] };
    // table selection
    case "tableSelection":
      return { ...state, selectedTable: action.payload };
    default:
      throw new Error("Unkown");
  }
}

function App() {
  // getting optional data from localStorage
  const savedData = JSON.parse(localStorage.getItem("data")) || initialState;
  const [
    {
      tables,
      todoTasks,
      inProgress,
      doneTasks,
      newTaskForm,
      newTableForm,
      selectedTable,
    },
    dispatch,
  ] = useReducer(reducer, savedData);
  console.log(selectedTable);

  // setting localStorage
  useEffect(
    function () {
      localStorage.setItem(
        "data",
        JSON.stringify({
          tables,
          todoTasks,
          inProgress,
          doneTasks,
          newTaskForm,
          selectedTable,
        })
      );
    },
    [tables, todoTasks, inProgress, doneTasks, newTaskForm, selectedTable]
  );

  return (
    <div className="app">
      <NavBar dispatch={dispatch} />
      <AllTables
        dispatch={dispatch}
        tables={tables}
        selectedTable={selectedTable}
      />
      <Table
        selectedTable={selectedTable}
        todoTasks={todoTasks}
        inProgress={inProgress}
        doneTasks={doneTasks}
      />
      {newTaskForm && <AddNewTask dispatch={dispatch} />}
      {newTableForm && <AddNewTable dispatch={dispatch} />}
    </div>
  );
}

function NavBar({ dispatch }) {
  return (
    <nav className="navBar">
      <h2>TableTasks</h2>
      <Button
        onClick={() => dispatch({ type: "newTaskForm" })}
        className="addTask"
      >
        +Add New Task
      </Button>
    </nav>
  );
}

function AllTables({ dispatch, tables, selectedTable }) {
  return (
    <div className="allTables">
      <p>ALL TABLES ({tables?.length})</p>
      <ul>
        {tables?.map((table, i) => (
          <li
            className={selectedTable === tables[i].title ? "selected" : ""}
            onClick={() =>
              dispatch({ type: "tableSelection", payload: tables[i].title })
            }
            key={i}
          >
            {table.title}
          </li>
        ))}
      </ul>
      <Button onClick={() => dispatch({ type: "newTableForm" })}>
        +Add New Table
      </Button>
    </div>
  );
}

function Table({ selectedTable, todoTasks, inProgress, doneTasks }) {
  return (
    <div className="table">
      <h2>{selectedTable}</h2>
      <div>
        <div>TODO ({todoTasks.length})</div>
        {todoTasks.map((task, i) => (
          <TableItem title={task.title} key={i} />
        ))}
      </div>
      <div>
        <div>IN PROGRESS ({inProgress.length})</div>
        {inProgress.map((task, i) => (
          <TableItem title={task.title} key={i} />
        ))}
      </div>
      <div>
        <div>DONE ({doneTasks.length})</div>
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
      // id: Math,
    });
    dispatch({ type: "newTaskForm" });
  }

  // console.log(task);
  return (
    <div className={"addNewTaskModal"}>
      <h3>Add New Task</h3>
      <label>Title</label>
      <Button onClick={() => dispatch({ type: "newTaskForm" })}>Close</Button>
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

      <Button onClick={() => handleTaskClear()}>Add Task</Button>
    </div>
  );
}

// add new table modal
function AddNewTable({ dispatch }) {
  // task state
  const [table, setTable] = useState({
    title: "",
    // id: Math,
  });

  // handling table input clear
  function handleTableClear() {
    // add
    dispatch({ type: "addTable", payload: table });
    setTable({
      title: "",
    });
    dispatch({ type: "newTableForm" });
  }

  return (
    <div className={"addNewTaskModal"}>
      <h3>Add New Table</h3>
      <Button onClick={() => dispatch({ type: "newTableForm" })}>Close</Button>
      <label>Table Title</label>
      <input
        placeholder="Store website things"
        value={table.title}
        onChange={(e) => setTable({ title: e.target.value })}
      />

      <Button onClick={() => handleTableClear()}>Add Table</Button>
    </div>
  );
}

export default App;
