import { useTable } from "../contexts/TableContext";
import Note from "./Note";

function NotesList() {
  const { tables, selectedTable } = useTable();
  const tableIndex = tables.findIndex((t) => t.title === selectedTable);

  return (
    <div className="notesBox">
      {tables[tableIndex]?.notes?.map((note) => (
        <Note key={note.id} note={note} />
      ))}
    </div>
  );
}

export default NotesList;
