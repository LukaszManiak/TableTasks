import { useTable } from "../contexts/TableContext";
import styles from "./TableItem.module.css";
export default function TableItem({ task }) {
  const { dispatch } = useTable();
  return (
    <div
      className={styles["tableItem"]}
      onClick={() => dispatch({ type: "taskSelection", payload: task })}
    >
      <p>{task.title}</p>
      {/* <p>0 of 3 done</p> */}
    </div>
  );
}
