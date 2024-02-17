import { useTable } from "../../contexts/TableContext";
import Button from "../UI/Button";
import styles from "./TableListItem.module.css";

function TableListItem({ table, i }) {
  const { dispatch, tables, selectedTable } = useTable();
  return (
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
        onClick={() => dispatch({ type: "tableDelete", payload: table.id })}
      >
        X
      </Button>
    </li>
  );
}

export default TableListItem;
