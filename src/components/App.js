import { useState } from "react";

// components
import Button from "./Button";
import Message from "./Message";
import { useTable } from "../contexts/TableContext";

function App() {
  const { isNewTaskOpen, isNewTableOpen, isTaskSelected } = useTable();

  return (
    <div className="app">
      <NavBar />
      <AllTables />
      <Table />
      {isNewTaskOpen && <AddNewTask />}
      {isNewTableOpen && <AddNewTable />}
      {isTaskSelected && <TaskBox />}
    </div>
  );
}

function NavBar() {
  const { dispatch } = useTable();

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

function AllTables() {
  const { dispatch, tables, selectedTable } = useTable();
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

function Table() {
  const { selectedTable, tables, dispatch } = useTable();

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
              <TableItem title={task.title} key={i} />
            ))}
          </div>
          <div>
            <div>IN PROGRESS ({tables[tableIndex].inProgress.length || 0})</div>
            {tables[tableIndex].inProgress.map((task, i) => (
              <TableItem title={task.title} key={i} />
            ))}
          </div>
          <div>
            <div>DONE ({tables[tableIndex].doneTasks.length || 0})</div>
            {tables[tableIndex].doneTasks.map((task, i) => (
              <TableItem title={task.title} key={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function TableItem({ title }) {
  const { dispatch } = useTable();
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

function TaskBox() {
  const { title, description, dispatch } = useTable();
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
function AddNewTask() {
  const { dispatch } = useTable();
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
function AddNewTable() {
  const { tables, dispatch } = useTable();
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
