import st from "./AlertLoginDialog.module.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const AlertLoginDialog = ({ onClose }) => {
  const navigate = useNavigate();

  const onClickLogin = (e) => {
    e.stopPropagation(); // 팝업 닫힘 방지
    navigate("/login"); // 로그인 페이지로 이동
  };

  return (
    <div className={st.alert} onClick={onClose}>
      <div className={st.button_body} onClick={(e) => e.stopPropagation()}>
        <div className={st.mark}>
          <div className={st.q_1}></div>
          <div className={st.q_2}></div>
        </div>
      </div>
      <div className={st.have_to}>
        <div className={st.button_text}>
          해당 기능을 사용하기 위해서는
          <br />
          로그인이 필요합니다!
        </div>
      </div>
      <div className={st.login_button}>
        <Button text={"로그인"} type={"midStroke"} onClick={onClickLogin} />
      </div>
    </div>
  );
};
export default AlertLoginDialog;
