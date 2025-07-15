import Button from "../Button";
import st from "./AlertDialog.module.css";
import alert_dialog from "../../assets/alert_dialog.svg";

// Props
// mainText: 주요 메시지(큰 텍스트)
// subText: 보조 메시지(작은 텍스트)
// onConfirm: '확인' 버튼 클릭 시 실행할 함수
// onCancel: '취소' 버튼 클릭 시 실행할 함수
// confirmText: 확인 버튼 텍스트(기본값: "삭제")
// confirmType: 확인 버튼의 스타일 타입(기본값: "midRed")
// 예 :
{
  /* <AlertDialog
  mainText={"명함을 삭제하시겠습니까?"}
  subText={"삭제하면 다시 복구할 수 없습니다."}
  onConfirm={handleDelete}
  onCancel={handleClose}
  confirmText={"삭제"}
  confirmType={"midRed"}
/>; */
}

const AlertDialog = ({
  mainText,
  subText,
  onConfirm,
  onCancel,
  confirmText = "삭제",
  confirmType = "midRed",
}) => {
  return (
    <div className={st.Overlay}>
      <div className={st.AlertDialog}>
        {/* 상단 경고 아이콘 이미지 */}
        <img
          className={st.Alert_dialog_img}
          src={alert_dialog}
          alt="alert_dialog"
        />

        {/* 텍스트 영역 */}
        <div className={st.Text_contanier}>
          <div className={st.Main}>{mainText}</div>
          <div className={st.Sub}>{subText}</div>
        </div>

        {/* 버튼 영역: 확인 및 취소 */}
        <div className={st.Confirm_buttons}>
          <Button text={confirmText} type={confirmType} onClick={onConfirm} />
          <Button text={"취소"} type={"midStroke"} onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
