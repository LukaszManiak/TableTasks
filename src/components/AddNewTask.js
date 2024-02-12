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
    subtasks: [
      { subVal: "", subId: new Date().getTime() + 1, checkedSub: false },
      { subVal: "", subId: new Date().getTime() + 2, checkedSub: false },
    ],
    type: "",
    id: new Date().getTime(),
  });

  // setting certain subtask value
  const handleSubValChange = (e, selectedSub) => {
    e.preventDefault();

    const newSubTasks = task.subtasks.map((subTask) =>
      subTask.subId === selectedSub.subId
        ? { ...selectedSub, subVal: e.target.value }
        : subTask
    );

    setTask({
      ...task,
      subtasks: newSubTasks,
    });
  };

  // add subtask
  function addSubtask() {
    setTask({
      ...task,
      subtasks: [
        ...task.subtasks,
        { subVal: "", subId: new Date().getTime(), checkedSub: false },
      ],
    });
  }

  // subtask delete
  function deleteSubTask(id) {
    setTask({
      ...task,
      subtasks: task.subtasks.filter((subTask) => subTask.subId !== id),
    });
  }

  // handling task inputs clear
  function handleTaskSubmit() {
    // add task
    dispatch({ type: "addTask", payload: task });

    // reset task state
    setTask({
      title: "",
      description: "",
      subtasks: [
        { subVal: "", subId: new Date().getTime() + 1, checkedSub: false },
        { subVal: "", subId: new Date().getTime() + 2, checkedSub: false },
      ],

      type: "",
      id: "",
    });
    // close task modal form
    dispatch({ type: "newTaskOpen" });
  }

  // console.log(task);
  return (
    <div className={styles["addNewTaskModal"]}>
      <h1>Add New Task</h1>
      <h2>Title</h2>
      <input
        className={styles.taskInput}
        placeholder="Platform setup"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />
      <h3>Description</h3>
      <textarea
        className={styles.taskTextArea}
        placeholder="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      ></textarea>
      <h4>Subtasks</h4>
      {task.subtasks?.map((subTask) => (
        <div className={styles["subBox"]} key={subTask.subId}>
          <input
            className={styles.taskInput}
            value={subTask.subVal}
            placeholder="e.g Make coffe..."
            onChange={(e) => handleSubValChange(e, subTask)}
          />
          <Button
            className="deleteSubTask"
            onClick={() => deleteSubTask(subTask.subId)}
          >
            X
          </Button>
        </div>
      ))}

      <Button className="addSubtask" onClick={() => addSubtask()}>
        +Add New Subtask
      </Button>

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
        <Button className="addButton" onClick={() => handleTaskSubmit()}>
          Add Task
        </Button>
        <Button
          className="closeButton"
          onClick={() => dispatch({ type: "newTaskOpen" })}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
