import { useTable } from "../../contexts/TableContext";
import styles from "./AlertBox.module.css";
function AlertBox() {
  const { wrongAlert } = useTable();

  return <div className={`${styles.alertBox}`}>{wrongAlert.msg}</div>;
}
export default AlertBox;
