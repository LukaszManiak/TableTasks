import { useTable } from "../contexts/TableContext";

// components
import Button from "./Button";
import Message from "./Message";
import AddNewTable from "./AddNewTable";
import AddNewTask from "./AddNewTask";
import NavBar from "./Navbar";
import TableItem from "./TableItem";
import { useEffect, useState } from "react";

function App() {
  const { isNewTaskOpen, isNewTableOpen, isTaskSelected } = useTable();

  return (
    <>
      <div className="entry-slide"></div>
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
    </>
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
          <div className="tableTitleNotes">
            <h2>{selectedTable}</h2>

            <div className="addNotes">
              <input placeholder="Add note..." />
              <Button className="addNote">+</Button>
            </div>
            <div className="notesBox">
              <div className="note">
                <p>
                  dwadhawjhbfdaw ujfbawifawdwadw adfwaf ugawufgbawufba wdwadh
                  awjhbfdawujfb awifawdwadwadfwafugawufgbawufba wdwa
                  dhawjhbfdawujfbawifawdwa dwadfwafug awufgbawuf
                  bawdwadhawjhbfdaw ujfbawifawdwadwadfwafugawufgb
                  awufbawdwadhawjh bfdawujfbawifawd wadwadfwafugawuf gbawu fbaws
                </p>
                <Button className="deleteNote">-</Button>
              </div>
              <div className="note">
                <p>
                  dwadhawjhbfdaw ujfbawifawdwadw adfwaf ugawufgbawufba wdwadh
                  awjhbfdawujfb awifawdwadwadfwafugawufgbawufba wdwa
                  dhawjhbfdawujfbawifawdwa dwadfwafug awufgbawuf
                  bawdwadhawjhbfdaw ujfbawifawdwadwadfwafugawufgb
                  awufbawdwadhawjh bfdawujfbawifawd wadwadfwafugawuf gbawu fbaws
                </p>
                <Button className="deleteNote">-</Button>
              </div>
            </div>
          </div>
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

function TaskBox() {
  const { currTask, dispatch } = useTable();

  const [subtasks, setSubtasks] = useState(currTask.subtasks);

  // handle checked task change
  function handleCheckedChange(id) {
    console.log(currTask, id);
    dispatch({
      type: "subtaskUpdate",
      payload: { taskId: currTask.id, subtaskId: id },
    });
  }

  // handle task type change
  function handleTypeChange(e) {
    e.preventDefault();

    dispatch({ type: "taskDelete", payload: currTask });
    dispatch({
      type: "addTask",
      payload: { ...currTask, type: e.target.value },
    });
  }

  // function handleTypeChange(e) {
  //   e.preventDefault();

  //   dispatch({
  //     type: "updateTaskType",
  //     payload: {
  //       taskId: currTask.id,
  //       taskType: currTask.type,
  //       newType: e.target.value,
  //     },
  //   });
  // }

  useEffect(
    function () {
      const newSubTasks = subtasks.filter((subTask) => subTask.subVal !== "");
      setSubtasks(newSubTasks);
    },
    [subtasks]
  );

  return (
    <div className="taskBox">
      <h2>{currTask.title}</h2>
      <p>{currTask.description}</p>

      {subtasks.length === 0 ? "" : <p>Subtasks (0 of {subtasks.length})</p>}
      {subtasks?.map((subTask) => (
        <div className="subTaskBox" key={subTask.subId}>
          <input
            onChange={() => handleCheckedChange(subTask.subId)}
            type="checkbox"
          />{" "}
          <p>{subTask.subVal}</p>
        </div>
      ))}

      {/* changing type of the currentTask */}
      <select value={currTask.type} onChange={(e) => handleTypeChange(e)}>
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
