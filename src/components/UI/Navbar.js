import { useTable } from "../../contexts/TableContext";
import styles from "./Navbar.module.css";

import Button from "./Button";

export default function NavBar() {
  const { dispatch, tables, mode } = useTable();

  return (
    <nav className={styles["navBar"]}>
      <h2>TableTasks📋</h2>
      <div className={styles["navButtons"]}>
        <Button
          disabled={!tables.length > 0}
          onClick={() => dispatch({ type: "newTaskOpen" })}
          className={!tables.length > 0 ? "addTaskBlocked" : "addTask"}
        >
          +Add New Task 🤓
        </Button>
        <Button
          onClick={() => dispatch({ type: "restartApp" })}
          className="restartApp"
        >
          Restart app 🧹
        </Button>
        <Button
          onClick={() => dispatch({ type: "toggleMode" })}
          className="modeToggle"
        >
          Mode {mode === "dark" ? "🌚" : "🌝"}
        </Button>
      </div>
    </nav>
  );
}
