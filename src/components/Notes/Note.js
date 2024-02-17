import { useTable } from "../../contexts/TableContext";
import Button from "../UI/Button";
import styles from "./Note.module.css";

function Note({ note }) {
  const { dispatch } = useTable();

  return (
    <div className={styles.note}>
      <p>{note.text}</p>
      <Button
        onClick={() =>
          dispatch({
            type: "deleteNote",
            payload: note.id,
          })
        }
        className="deleteNote"
      >
        -
      </Button>
    </div>
  );
}

export default Note;
