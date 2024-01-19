import { useTable } from "../contexts/TableContext";

// components
import Button from "./Button";
import Message from "./Message";
import AddNewTable from "./AddNewTable";
import AddNewTask from "./AddNewTask";
import NavBar from "./Navbar";
import { useState } from "react";

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
      {(isNewTableOpen || isNewTaskOpen || isTaskSelected) && (
        <div className="dark-bg"></div>
      )}
    </div>
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
            <p>{table.title}</p>
            <Button
              className="deleteTable"
              onClick={() =>
                dispatch({ type: "tableDelete", payload: table.id })
              }
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      <Button
        className="addNewTable"
        onClick={() => dispatch({ type: "newTableOpen" })}
      >
        +Add New Table
      </Button>
    </div>
  );
}

function Table() {
  const { selectedTable, tables } = useTable();

  const tableIndex = tables.findIndex((t) => t.title === selectedTable);

  return (
    <div className="table">
      {!selectedTable && (
        <Message
          className="startMsg"
          message={"Make a table and start adding your tasks!"}
        ></Message>
      )}
      {selectedTable && (
        <>
          <h2>{selectedTable}</h2>
          <div>
            <div>TODO ({tables[tableIndex]?.todoTasks?.length || 0})</div>
            <div className="tableItems">
              {tables[tableIndex]?.todoTasks?.map((task, i) => (
                <TableItem task={task} key={i} />
              ))}
            </div>
          </div>
          <div>
            <div>
              IN PROGRESS ({tables[tableIndex]?.inProgress?.length || 0})
            </div>
            <div className="tableItems">
              {tables[tableIndex]?.inProgress?.map((task, i) => (
                <TableItem task={task} key={i} />
              ))}
            </div>
          </div>
          <div>
            <div>DONE ({tables[tableIndex]?.doneTasks?.length || 0})</div>
            <div className="tableItems">
              {tables[tableIndex]?.doneTasks?.map((task, i) => (
                <TableItem task={task} key={i} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function TableItem({ task }) {
  const { dispatch } = useTable();
  return (
    <div
      className="tableItem"
      onClick={() => dispatch({ type: "taskSelection", payload: task })}
    >
      <p>{task.title}</p>
      {/* <p>0 of 3 done</p> */}
    </div>
  );
}

function TaskBox() {
  const { currTask, dispatch } = useTable();

  const checkedSubTasks = currTask.subtasks.filter(
    (subTask) => subTask.subVal !== ""
  );

  function handleChange(e) {
    e.preventDefault();

    dispatch({ type: "taskDelete", payload: currTask });
    dispatch({
      type: "addTask",
      payload: { ...currTask, type: e.target.value },
    });
  }

  return (
    <div className="taskBox">
      <h2>{currTask.title}</h2>
      <p>{currTask.description}</p>

      <p>Subtasks (0 of {currTask.subtasks.length})</p>
      {checkedSubTasks.map((subTask) => (
        <div className="subTaskBox" key={subTask.subId}>
          <input type="checkbox" /> <p>{subTask.subVal}</p>
        </div>
      ))}

      {/* changing type of the currentTask */}
      <select value={currTask.type} onChange={(e) => handleChange(e)}>
        <option value={"todo"}>Todo</option>
        <option value={"inprogress"}>In progress</option>
        <option value={"done"}>Done</option>
      </select>
      <div className="buttonsContainer">
        <Button
          className="deleteTask"
          onClick={() => dispatch({ type: "taskDelete", payload: currTask })}
        >
          Delete task
        </Button>
        <Button
          className="closeButton"
          onClick={() => dispatch({ type: "taskSelection" })}
        >
          X
        </Button>
      </div>
    </div>
  );
}

export default App;
