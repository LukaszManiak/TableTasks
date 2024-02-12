import styles from "./Button.module.css";

export default function Button({ children, onClick, className = "" }) {
  return (
    <button className={styles[className]} onClick={onClick}>
      {children}
    </button>
  );
}
