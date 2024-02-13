import { useTable } from "../../contexts/TableContext";
import styles from "./TableItem.module.css";
export default function TableItem({ task }) {
  const { dispatch } = useTable();
  return (
    <div
      className={`${styles["tableItem"]} ${styles[task.type]}`}
      onClick={() => dispatch({ type: "taskSelection", payload: task })}
    >
      <p>
        <b>{task.title}</b>
      </p>
      {task.subtasks.length !== 0 && <p>0 of {task.subtasks.length} done</p>}
    </div>
  );
}