import { useTable } from "../contexts/TableContext";
import Button from "./Button";

function Note({ note }) {
  const { dispatch } = useTable();

  return (
    <div className="note">
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
