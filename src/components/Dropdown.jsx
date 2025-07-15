import { useState } from "react";
import styles from "./Dropdown.module.css";
import dropdown_button from "../assets/dropdown_button.svg";

// Props
// type: default는 없어도 됨. 긴 버전이면 "long"
// children: 드롭다운 option 요소들. (div, span 등)
// selected: 옵션 값 (string 해도 되고, 설정된 옵션값 넣기)
// onChange: 값 선택될 때 호출되는 콜백 함수
// 예: 긴 버전, animal 타입, setAnimal 콜백 함수
{
  /* <Dropdown
  type={"long"}
  selected={animal}
  onChange={(value) => setAnimal(value)}
>
  <div>강아지</div>
  <div>고양이</div>
  <div>곰</div>
  <div>개구리</div>
  <div>돼지</div>
  <div>토끼</div>
</Dropdown>; */
}

const Dropdown = ({ type, children, selected, onChange }) => {
  // state: 드롭다운 열림/닫힘 상태 (드롭다운 토글용)
  const [isOpen, setIsOpen] = useState(false);

  // 드롭다운 열림/닫힘 토글
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 옵션 클릭 시 선택 처리
  const handleSelect = (value) => {
    // 부모로 값 전달
    if (onChange) onChange(value);

    // 드롭다운 닫기
    setIsOpen(false);
  };

  return (
    <div className={`${styles.Dropdown} ${styles[`Dropdown_${type}`]}`}>
      {/* 선택 영역 (placeholder 또는 선택된 텍스트 + 버튼) */}
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

      {/* 드롭다운 옵션 목록 (열려 있을 때만 표시) */}
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
