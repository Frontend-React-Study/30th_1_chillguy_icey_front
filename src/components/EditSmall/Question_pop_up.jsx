import st from "./Question_pop_up.module.css";
import Button from "../Button";

// Question_pop_up 컴포넌트: 질문 변경 확인 팝업
const Question_pop_up = ({
  currentCount,
  maxCount,
  onConfirm,
  onCancel,
  disableConfirmButton,
}) => {
  return (
    <div className={st.overlay}>
      {" "}
      {/* 배경을 어둡게 하는 오버레이 추가 */}
      <div className={st.popupContainer}>
        <div className={st.iconBackground}>
          <div className={st.exclamationMarkGroup}>
            <div className={st.exclamationTop}></div>
            <div className={st.exclamationDot}></div>
          </div>
        </div>
        <div className={st.textSection}>
          <div className={st.popupTitle}>질문을 변경하시겠습니까?</div>
          <div className={st.popupDescription}>
            총 {maxCount}번 변경할 수 있으며, 변경 후 되돌릴 수 없습니다.
          </div>
          <div className={st.popupCountText}>
            현재까지 변경 횟수: {currentCount} / {maxCount}
          </div>
        </div>
        <div className={st.buttonGroup}>
          <Button
            text={"바꾸기"}
            type={"red"}
            onClick={onConfirm} // 확인 버튼 클릭 시 onConfirm 호출
            disabled={disableConfirmButton} // 버튼 비활성화 여부
          />
          <Button
            text={"취소"}
            type={"midStroke"}
            onClick={onCancel} // 취소 버튼 클릭 시 onCancel 호출
          />
        </div>
      </div>
    </div>
  );
};

export default Question_pop_up;
