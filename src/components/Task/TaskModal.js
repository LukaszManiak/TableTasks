import { useTable } from "../../contexts/TableContext";
import styles from "./TaskModal.module.css";
import Button from "../UI/Button";

function TaskModal() {
  const { currTask, dispatch } = useTable();

  // handle checked task change
  function handleCheckedChange(id) {
    dispatch({
      type: "subtaskUpdate",
      payload: { taskToEnter: currTask.id, subToChangeId: id },
    });
  }

  // handle task type change
  function handleTypeChange(e) {
    e.preventDefault();

    // updated version
    dispatch({
      type: "taskTypeUpdate",
      payload: { taskToChangeType: currTask.id, newType: e.target.value },
    });
  }

  return (
    <div className={styles.taskBox}>
      <h2>{currTask.title}</h2>
      <p>{currTask.description}</p>

      {currTask.subtasks.length === 0 ? (
        ""
      ) : (
        <p>
          Subtasks (
          {currTask.subtasks.filter((sub) => sub.checkedSub === true).length} of{" "}
          {currTask.subtasks.length})
        </p>
      )}
      {currTask.subtasks?.map((subTask) => (
        <div className={styles.subTaskBox} key={subTask.subId}>
          <input
            onChange={() =>
              handleCheckedChange(subTask.subId, subTask.checkedSub)
            }
            type="checkbox"
            // set checked
            checked={subTask.checkedSub}
          />{" "}
          <p className={subTask.checkedSub ? styles.subDone : ""}>
            {subTask.subVal}
          </p>
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

export default TaskModal;
