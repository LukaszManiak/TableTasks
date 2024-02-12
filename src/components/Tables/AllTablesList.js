import { useTable } from "../../contexts/TableContext";
import styles from "./AllTablesList.module.css";
import Button from "../UI/Button";

function AllTablesList() {
  const { dispatch, tables, selectedTable } = useTable();

  return (
    <div className={styles.allTables}>
      <p>ALL TABLES ({tables?.length})</p>
      <ul>
        {tables.map((table, i) => (
          <li
            className={selectedTable === tables[i].title ? styles.selected : ""}
            onClick={() =>
              dispatch({ type: "tableSelection", payload: tables[i].title })
            }
            key={i}
          >
            <p>{table.title}</p>
            <Button
              className="deleteTable"
              onClick={() =>
                dispatch({ type: "tableDelete", payload: table.id })
              }
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      <Button
        className="addNewTable"
        onClick={() => dispatch({ type: "newTableOpen" })}
      >
        +Add New Table
      </Button>
    </div>
  );
}

export default AllTablesList;
