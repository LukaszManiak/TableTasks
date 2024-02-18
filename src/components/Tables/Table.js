import { useTable } from "../../contexts/TableContext";
import AddNotesForm from "../Forms/AddNotesForm";
import NotesList from "../Notes/NotesList";
import Message from "../UI/Message";
import TableItem from "./TableItem";

import styles from "./Table.module.css";

function Table() {
  const { selectedTable, tables } = useTable();

  const tableIndex = tables.findIndex((t) => t.title === selectedTable);

  return (
    <div className={styles.table}>
      {!selectedTable && (
        <Message
          className="startMsg"
          message={"Make a table and start adding your tasks!"}
        ></Message>
      )}
      {selectedTable && (
        <>
          <div className={styles.tableTitleNotes}>
            <h2 className={styles.selectedTitle}>{selectedTable}</h2>

            <AddNotesForm />
            <NotesList />
          </div>
          <div>
            <div>TODO ({tables[tableIndex]?.todoTasks?.length || 0}) 📝</div>
            <div className={styles.tableItems}>
              {tables[tableIndex]?.todoTasks?.map((task, i) => (
                <TableItem task={task} key={i} />
              ))}
            </div>
          </div>
          <div>
            <div>
              IN PROGRESS ({tables[tableIndex]?.inProgress?.length || 0}) 🧗‍♂️
            </div>
            <div className={styles.tableItems}>
              {tables[tableIndex]?.inProgress?.map((task, i) => (
                <TableItem task={task} key={i} />
              ))}
            </div>
          </div>
          <div>
            <div>DONE ({tables[tableIndex]?.doneTasks?.length || 0}) 🎉</div>
            <div className={styles.tableItems}>
              {tables[tableIndex]?.doneTasks?.map((task, i) => (
                <TableItem task={task} key={i} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Table;
