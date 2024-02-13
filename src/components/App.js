import { useTable } from "../contexts/TableContext";

// components
import Button from "./UI/Button";
import Message from "./UI/Message";
import AddNewTable from "./Forms/AddNewTable";
import AddNewTask from "./Forms/AddNewTask";
import NavBar from "./UI/Navbar";
import TableItem from "./Tables/TableItem";
import AllTablesList from "./Tables/AllTablesList";

import AddNotesForm from "./Forms/AddNotesForm";
import NotesList from "./Notes/NotesList";
import AlertBox from "./UI/AlertBox";

function App() {
  const { isNewTaskOpen, isNewTableOpen, isTaskSelected, wrongAlert } =
    useTable();

  return (
    <>
      <div className="entry-slide"></div>
      <div className="app">
        <NavBar />
        <AllTablesList />
        <Table />
        {wrongAlert?.isShown && <AlertBox />}
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

            <AddNotesForm />
            <NotesList />
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

  return (
    <div className="taskBox">
      <h2>{currTask.title}</h2>
      <p>{currTask.description}</p>

      {currTask.subtasks.length === 0 ? (
        ""
      ) : (
        <p>Subtasks (0 of {currTask.subtasks.length})</p>
      )}
      {currTask.subtasks?.map((subTask) => (
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
