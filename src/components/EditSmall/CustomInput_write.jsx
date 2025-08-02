import { useState, useRef, useEffect } from "react";
import Button from "../Button";
import st from "./CustomInput_write.module.css";
function CustomInput_write({ onSave, onCancel }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setValue(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "28px";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "28px";
    }
  }, []);

  return (
    <div className={st.writeCardContainer}>
      <div className={st.textareaWrapper}>
        <textarea
          className={st.questionTextarea}
          ref={textareaRef}
          placeholder="직접 작성..."
          value={value}
          onChange={handleChange}
          spellCheck={false}
        />
        <div className={st.textareaUnderline}></div>
      </div>
      <div className={st.buttonGroup}>
        <Button text={"저장"} type={"midBlue"} onClick={() => onSave(value)} />
        <Button text={"취소"} type={"midStroke"} onClick={onCancel} />
      </div>
    </div>
  );
}

export default CustomInput_write;
