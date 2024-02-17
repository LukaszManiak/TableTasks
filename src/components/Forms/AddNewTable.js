import styles from "./AddNewTable.module.css";

import { useState } from "react";
import { useTable } from "../../contexts/TableContext";

import Button from "../UI/Button";

export default // add new table modal
function AddNewTable() {
  const { dispatch, tables } = useTable();
  // task state
  const [table, setTable] = useState({
    title: "",
    id: new Date().getTime(),
    notes: [],
    // table todos
    todoTasks: [],
    inProgress: [],
    doneTasks: [],
  });

  //  handle new table submit
  function handleTableSubmit() {
    // checking if the title input is empty
    if (table.title === "") {
      dispatch({
        type: "alertUser",
        payload:
          "You cannot add new table without any title! Please try again.",
      });
      // checking if there is already a table with the same title
    } else if (tables.map((table) => table.title).includes(table.title)) {
      dispatch({
        type: "alertUser",
        payload:
          "There is already a table with that title! Please try again with the new one.",
      });
      // adding new table
    } else {
      // add
      dispatch({ type: "addTable", payload: table });
      // reset table state
      setTable({
        title: "",
        id: "",
        notes: [],
        // table todos
        todoTasks: [],
        inProgress: [],
        doneTasks: [],
      });
      // close table modal form
      dispatch({ type: "newTableOpen" });
    }
  }
  return (
    <div className={styles.addNewTableModal}>
      <h1>Add New Table</h1>

      <p>Table Title</p>
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
        <Button
          className="closeButton"
          type="submit"
          onClick={() => dispatch({ type: "newTableOpen" })}
        >
          Close
        </Button>
      </div>
    </div>
  );
}
