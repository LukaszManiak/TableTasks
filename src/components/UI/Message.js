import styles from "./Message.module.css";

export default function Message({ message, className }) {
  return <h1 className={styles[className]}>{message}</h1>;
}
