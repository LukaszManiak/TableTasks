import { useTable } from "../contexts/TableContext";
import styles from "./Navbar.module.css";

import Button from "./Button";

export default function NavBar() {
  const { dispatch } = useTable();

  return (
    <nav className={styles["navBar"]}>
      <h2>TableTasks</h2>
      <div className={styles["navButtons"]}>
        <Button
          onClick={() => dispatch({ type: "newTaskOpen" })}
          className="addTask"
        >
          +Add New Task
        </Button>
        <Button
          onClick={() => dispatch({ type: "restartApp" })}
          className="restartApp"
        >
          Restart app
        </Button>
        <Button
          onClick={() => dispatch({ type: "toggleMode" })}
          className="modeToggle"
        >
          Mode
        </Button>
      </div>
    </nav>
  );
}
