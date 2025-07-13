import Button from "../Button";
import st from "./AlertDialog.module.css";
import alert_dialog from "../../assets/alert_dialog.svg";

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
        <img
          className={st.Alert_dialog_img}
          src={alert_dialog}
          alt="alert_dialog"
        />
        <div className={st.Text_contanier}>
          <div className={st.Main}>{mainText}</div>
          <div className={st.Sub}>{subText}</div>
        </div>
        <div className={st.Confirm_buttons}>
          <Button text={confirmText} type={confirmType} onClick={onConfirm} />
          <Button text={"취소"} type={"midStroke"} onClick={onCancel} />
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;
