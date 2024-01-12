import { useEffect, useReducer, useState } from "react";

// components
import Button from "./Button";
import Message from "./Message";

const initialState = {
  // tables
  tables: [],
  // currently selected table
  selectedTable: null,
  //isNewTaskOpen
  isNewTaskOpen: false,
  isNewTableOpen: false,

  // task selection
  isTaskSelected: false,
  currTask: null,
};

function reducer(state, action) {
  switch (action.type) {
    //opening task modal form
    case "newTaskOpen":
      return { ...state, isNewTaskOpen: !state.isNewTaskOpen };
    //opening table modal form
    case "newTableOpen":
      return { ...state, isNewTableOpen: !state.isNewTableOpen };
    // add task
    case "addTask":
      // type of the task
      const actionType = action.payload.type;
      // currently opened table
      const currTable = state.tables
        .map((t) => t.title)
        .indexOf(state.selectedTable);

      // checking for tables and selected table
      if (!state.tables.length || !state.selectedTable) return state;

      if (actionType === "todo") {
        // iterating through all tables and adding given task only to the opened one
        return {
          ...state,
          tables: state.tables.map((table, i) => {
            if (i === currTable) {
              return {
                ...table,
                todoTasks: [...table.todoTasks, action.payload],
              };
            }
            return table;
          }),
        };
      } else if (actionType === "inprogress") {
        return {
          ...state,
          tables: state.tables.map((table, i) => {
            if (i === currTable) {
              return {
                ...table,
                inProgress: [...table.inProgress, action.payload],
              };
            }
            return table;
          }),
        };
      } else if (actionType === "done") {
        return {
          ...state,
          tables: state.tables.map((table, i) => {
            if (i === currTable) {
              return {
                ...table,
                doneTasks: [...table.doneTasks, action.payload],
              };
            }
            return table;
          }),
        };
      } else {
        return state;
      }

    // add table
    case "addTable":
      // if the title input is empty return
      if (action.payload.title === "") return state;
      // if there is already table with the same name return
      if (state.tables.map((t) => t.title).includes(action.payload.title))
        return state;
      // returning table with the given title and tasks array
      return {
        ...state,
        tables: [
          ...state.tables,
          {
            title: action.payload.title,
            // table todos
            todoTasks: [],
            inProgress: [],
            doneTasks: [],
          },
        ],
      };
    // table selection
    case "tableSelection":
      return { ...state, selectedTable: action.payload };

    // selected task details open
    case "taskSelection":
      return {
        ...state,
        isTaskSelected: !state.isTaskSelected,
        currTask: action.payload,
      };
    default:
      throw new Error("Unkown");
  }
}

function App() {
  // getting optional data from localStorage / initial state
  const savedData = JSON.parse(localStorage.getItem("data")) || initialState;
  const [
    {
      tables,
      isNewTaskOpen,
      isNewTableOpen,
      selectedTable,
      isTaskSelected,
      currTask,
    },
    dispatch,
  ] = useReducer(reducer, savedData);

  // effect that selects the newly created table
  useEffect(
    function () {
      dispatch({
        type: "tableSelection",
        payload: tables[tables.length - 1]?.title,
      });
    },
    [tables.length]
  );

  // setting localStorage
  useEffect(
    function () {
      localStorage.setItem(
        "data",
        JSON.stringify({
          tables,
          isNewTaskOpen,
          isNewTableOpen,
          selectedTable,

          isTaskSelected,
          currTask,
        })
      );
    },
    [
      tables,
      isNewTaskOpen,
      selectedTable,
      isNewTableOpen,
      isTaskSelected,
      currTask,
    ]
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
        tables={tables}
        selectedTable={selectedTable}
        dispatch={dispatch}
      />
      {isNewTaskOpen && <AddNewTask dispatch={dispatch} />}
      {isNewTableOpen && <AddNewTable dispatch={dispatch} tables={tables} />}
      {isTaskSelected && <TaskBox dispatch={dispatch} />}
    </div>
  );
}

function NavBar({ dispatch }) {
  return (
    <nav className="navBar">
      <h2>TableTasks</h2>
      <Button
        onClick={() => dispatch({ type: "newTaskOpen" })}
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
        {tables.map((table, i) => (
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
      <Button onClick={() => dispatch({ type: "newTableOpen" })}>
        +Add New Table
      </Button>
    </div>
  );
}

function Table({ selectedTable, tables, dispatch }) {
  const tableIndex = tables.findIndex((t) => t.title === selectedTable);

  return (
    <div className="table">
      {!selectedTable && (
        <Message
          message={"Make a table and start adding your tasks!"}
        ></Message>
      )}
      {selectedTable && (
        <>
          <h2>{selectedTable}</h2>
          <div>
            <div>TODO ({tables[tableIndex].todoTasks.length || 0})</div>
            {tables[tableIndex].todoTasks.map((task, i) => (
              <TableItem dispatch={dispatch} title={task.title} key={i} />
            ))}
          </div>
          <div>
            <div>IN PROGRESS ({tables[tableIndex].inProgress.length || 0})</div>
            {tables[tableIndex].inProgress.map((task, i) => (
              <TableItem dispatch={dispatch} title={task.title} key={i} />
            ))}
          </div>
          <div>
            <div>DONE ({tables[tableIndex].doneTasks.length || 0})</div>
            {tables[tableIndex].doneTasks.map((task, i) => (
              <TableItem dispatch={dispatch} title={task.title} key={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TableItem({ title, dispatch }) {
  return (
    <div
      className="tableItem"
      onClick={() => dispatch({ type: "taskSelection", payload: "" })}
      // onClick={() => console.log()}
    >
      <p>{title}</p>
      {/* <p>0 of 3 done</p> */}
    </div>
  );
}

function TaskBox({ title, description, dispatch }) {
  return (
    <div className="taskBox">
      <p>{title}</p>
      <p>{description}</p>
      <button onClick={() => dispatch({ type: "taskSelection", payload: "" })}>
        X
      </button>
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
    // id: Math,
  });

  // handling task inputs clear
  function handleTaskSubmit() {
    // add task
    dispatch({ type: "addTask", payload: task });

    // reset task state
    setTask({
      title: "",
      description: "",
      type: "",
      // id: Math,
    });
    // close task modal form
    dispatch({ type: "newTaskOpen" });
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
      <div className="modaButtonsContainer">
        <Button onClick={() => handleTaskSubmit()}>Add Task</Button>
        <Button onClick={() => dispatch({ type: "newTaskOpen" })}>Close</Button>
      </div>
    </div>
  );
}

// add new table modal
function AddNewTable({ dispatch, tables }) {
  // task state
  const [table, setTable] = useState({
    title: "",
    // id: Math,
  });

  // handling table input clear
  function handleTableSubmit() {
    // add
    dispatch({ type: "addTable", payload: table });
    // reset table state
    setTable({
      title: "",
    });
    // close table modal form
    dispatch({ type: "newTableOpen" });
  }

  return (
    <div className={"addNewTaskModal"}>
      <h3>Add New Table</h3>
      <Button onClick={() => dispatch({ type: "newTableOpen" })}>Close</Button>
      <label>Table Title</label>
      <input
        placeholder="Store website things"
        value={table.title}
        onChange={(e) => setTable({ title: e.target.value })}
      />
      <div className="modaButtonsContainer">
        <Button onClick={() => handleTableSubmit()}>Add Table</Button>
        <Button onClick={() => dispatch({ type: "newTableOpen" })}>
          Close
        </Button>
      </div>
    </div>
  );
}

export default App;
