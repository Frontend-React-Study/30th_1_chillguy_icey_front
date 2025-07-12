import { useState } from "react";
import styles from "./Dropdown.module.css";
import dropdown_button from "../assets/dropdown_button.svg";

const Dropdown = ({ type, children, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value) => {
    if (onChange) onChange(value);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.Dropdown} ${styles[`Dropdown_${type}`]}`}>
      <div className={styles.Input} onClick={toggleDropdown}>
        <span className={selected ? styles.SelectedText : styles.Placeholder}>
          {selected || "선택 없음"}
        </span>
        <img
          src={dropdown_button}
          alt="dropdown_button"
          className={`${styles.Dropdown_button} ${isOpen ? styles.Rotate : ""}`}
        />
      </div>
      {isOpen && (
        <div
          className={`${styles.Option_wrapper} ${type === "long" ? styles.Option_wrapper_long : ""}`}
        >
          {children.map((child, index) => (
            <div
              key={index}
              className={styles.Option}
              onClick={() => handleSelect(child.props.children)}
            >
              {child}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
