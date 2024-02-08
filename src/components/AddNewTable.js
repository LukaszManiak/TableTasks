import styles from "./AddNewTable.module.css";

import { useState } from "react";
import { useTable } from "../contexts/TableContext";

import Button from "./Button";

export default // add new table modal
function AddNewTable() {
  const { dispatch } = useTable();
  // task state
  const [table, setTable] = useState({
    title: "",
    id: new Date().getTime(),
    // table todos
    todoTasks: [],
    inProgress: [],
    doneTasks: [],
  });

  console.log(table);
  // handling table input clear
  function handleTableSubmit() {
    // add
    dispatch({ type: "addTable", payload: table });
    // reset table state
    setTable({
      title: "",
      id: "",
      // table todos
      todoTasks: [],
      inProgress: [],
      doneTasks: [],
    });
    // close table modal form
    dispatch({ type: "newTableOpen" });
  }
  return (
    <form
      className={styles.addNewTableModal}
      onSubmit={() => dispatch({ type: "newTableOpen" })}
    >
      <h1>Add New Table</h1>

      <label htmlFor="title">Table Title</label>
      <input
        className={styles.input}
        placeholder="Store website things"
        value={table.title}
        onChange={(e) => setTable({ ...table, title: e.target.value })}
      />
      <div className="buttonsContainer">
        <Button className="addButton" onClick={() => handleTableSubmit()}>
          Add Table
        </Button>
        <Button className="closeButton" type="submit">
          Close
        </Button>
      </div>
    </form>
  );
}
