import styles from "./Button.module.css";

export default function Button({
  disabled = false,
  children,
  onClick,
  className = "",
}) {
  return (
    <button disabled={disabled} className={styles[className]} onClick={onClick}>
      {children}
    </button>
  );
}
