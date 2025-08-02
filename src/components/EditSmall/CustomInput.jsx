import { useState, useEffect, useRef } from "react";
import Button from "../Button";
import st from "./CustomInput.module.css";

// CustomInput 컴포넌트: 사용자가 직접 작성한 질문을 표시하고 삭제 기능을 제공합니다.
function CustomInput({ id, text, onDelete }) {
  // 이 컴포넌트는 상세 내용(initialDetailText)을 받지 않으므로 관련 상태 및 로직을 제거합니다.

  return (
    <div className={st.customInputCard}>
      <div className={st.customInputHeader}>
        <div className={st.customInputText}>{text}</div>
        <div className={st.customInputActions}>
          <Button
            text={"삭제"}
            type={"bred"}
            onClick={(e) => {
              e.stopPropagation(); // 클릭 이벤트 상위 전파 방지
              if (onDelete) onDelete(id); // onDelete 호출 시 id 전달
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default CustomInput;
