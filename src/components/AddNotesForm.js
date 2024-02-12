import { useState } from "react";
import { useTable } from "../contexts/TableContext";
import Button from "./Button";

function AddNotesForm() {
  const { dispatch } = useTable();

  const [note, setNote] = useState("");

  function handleNoteChange(e) {
    e.preventDefault();
    setNote(e.target.value);
  }

  function handleAddNote() {
    dispatch({
      type: "addNote",
      payload: { text: note, id: Date.now() + Math.random() },
    });
    setNote("");
  }

  return (
    <div className="addNotes">
      <input
        onChange={(e) => handleNoteChange(e)}
        className="noteInput"
        placeholder="Add note..."
        value={note}
      />
      <Button onClick={() => handleAddNote()} className="addNote">
        +
      </Button>
    </div>
  );
}

export default AddNotesForm;
