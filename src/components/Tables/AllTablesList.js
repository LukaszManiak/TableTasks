import { useTable } from "../../contexts/TableContext";
import styles from "./AllTablesList.module.css";
import Button from "../UI/Button";
import TableListItem from "./TableListItem";

function AllTablesList() {
  const { dispatch, tables } = useTable();

  return (
    <div className={styles.allTables}>
      <p>ALL TABLES ({tables?.length})</p>
      <ul>
        {tables.map((table, i) => (
          <TableListItem key={table.id} table={table} i={i} />
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
