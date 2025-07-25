import st from "./Massage.module.css";
import { useNavigate } from "react-router-dom";

const Massage = (team) => {
  const navigate = useNavigate();

  const handleMassageClick = () => {
    navigate("/letter", { state: team });
  };
  return (
    <div className={st.Massage_button} onClick={handleMassageClick}>
      <div className={st.massage_back}>
        <div className={st.massage_Inner}></div>
      </div>
      <div className={st.massage_front}>
        <div className={st.massage_title}>쪽지함</div>
        <div className={st.massage_subtitle}>쪽지 & 팀 명함 확인하기</div>
      </div>
    </div>
  );
};

export default Massage;
