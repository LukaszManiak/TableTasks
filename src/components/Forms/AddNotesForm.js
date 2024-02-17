import { useState } from "react";
import { useTable } from "../../contexts/TableContext";
import Button from "../UI/Button";

import styles from "./AddNotesForm.module.css";

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
    <>
      <h4>Notes ✍🏼</h4>
      <div className={styles.addNotes}>
        <input
          onChange={(e) => handleNoteChange(e)}
          className={styles.noteInput}
          placeholder="Add note..."
          value={note}
        />
        <Button onClick={() => handleAddNote()} className="addNote">
          +
        </Button>
      </div>
    </>
  );
}

export default AddNotesForm;
