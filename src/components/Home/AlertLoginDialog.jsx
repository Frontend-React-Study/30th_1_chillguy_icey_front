import st from "./AlertLoginDialog.module.css";
import alert_dialog from "../../assets/alert_dialog.svg";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const AlertLoginDialog = ({ onClose }) => {
  const navigate = useNavigate();

  const onClickLogin = (e) => {
    e.stopPropagation(); // 팝업 닫힘 방지
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <div className={st.overlay} onClick={onClose}>
      <div className={st.AlertDialog} onClick={(e) => e.stopPropagation()}>
        {/* 상단 경고 아이콘 이미지 */}
        <img
          className={st.Alert_dialog_img}
          src={alert_dialog}
          alt="alert_dialog"
        />

        {/* 텍스트 영역 */}
        <div className={st.Text_contanier}>
          <div className={st.Main}>
            해당 기능을 사용하기 위해서는
            <br />
            로그인이 필요합니다!
          </div>
        </div>

        {/* 버튼 영역: 확인 및 취소 */}
        <div className={st.Confirm_buttons}>
          <Button text={"로그인"} type={"midStroke"} onClick={onClickLogin} />
        </div>
      </div>
    </div>
  );
};
export default AlertLoginDialog;
