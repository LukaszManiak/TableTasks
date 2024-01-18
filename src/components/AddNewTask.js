import styles from "./AddNewTask.module.css";

import { useState } from "react";
import { useTable } from "../contexts/TableContext";

import Button from "./Button";

export default // add new task modal
function AddNewTask() {
  const { dispatch } = useTable();
  // task state
  const [task, setTask] = useState({
    title: "",
    description: "",
    subtasks: [],
    type: "",
    id: new Date().getTime(),
  });

  // handling task inputs clear
  function handleTaskSubmit(e) {
    e.preventDefault();
    // add task
    dispatch({ type: "addTask", payload: task });

    // reset task state
    setTask({
      title: "",
      description: "",
      type: "",
      id: "",
    });
    // close task modal form
    dispatch({ type: "newTaskOpen" });
  }

  // console.log(task);
  return (
    <form className={styles["addNewTaskModal"]} onSubmit={handleTaskSubmit}>
      <h1>Add New Task</h1>
      <h2>Title</h2>
      <input
        placeholder="Platform setup"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <h3>Description</h3>
      <input
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />
      <h4>Subtasks</h4>
      <div className={styles["subBox"]}>
        <input placeholder="e.g Make coffe..." />
        <button>X</button>
      </div>
      <div className={styles["subBox"]}>
        <input placeholder="e.g Make coffe..." />
        <button>X</button>
      </div>
      <Button className="addSubtask">+Add New Subtask</Button>

      <h5>Status</h5>
      <select
        value={task.type}
        onChange={(e) => setTask({ ...task, type: e.target.value })}
      >
        <option value={""}>Select Option</option>
        <option value={"todo"}>Todo</option>
        <option value={"inprogress"}>In progress</option>
        <option value={"done"}>Done</option>
      </select>
      <div className="buttonsContainer">
        <Button className="addButton" type="submit">
          Add Task
        </Button>
        <Button
          className="closeButton"
          onClick={() => dispatch({ type: "newTaskOpen" })}
        >
          Close
        </Button>
      </div>
    </form>
  );
}
