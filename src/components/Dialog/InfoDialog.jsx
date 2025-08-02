import st from "./InfoDialog.module.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { fetchAcceptTeamLink } from "../../util/TeamDataAPI";
import { useAuth } from "../../context/AuthContext";

const InfoDialog = ({ linkTeam, invitationToken }) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleConfirm = async () => {
    try {
      const res = await fetchAcceptTeamLink(invitationToken);
      console.log("초대 수락 반응 확인 : ", res);

      // res가 undefined일 경우를 방지
      if (!res) {
        throw new Error("응답 데이터가 없습니다.");
      }

      navigate("/team", {
        state: {
          linkMessage: res.message,
          linkStatus: res.status,
          linkTeamId: res.data?.teamId ?? res.teamId,
        },
      });
    } catch (error) {
      console.error("예외 발생", error);
      navigate("/");
    }
  };

  // const acceptInvitation = async () => {
  //   const res = await fetchAcceptTeamLink(invitationToken);

  //   return res;
  // };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={st.info_black_background}>
      <div className={st.info_popup_space}>
        <div className={st.info_text_space}>초대를 수락하시겠습니까?</div>

        <div className={st.info_select_space}>
          <div className={st.info_mid_size_text_space}>
            <div className={st.info_mid_size_text}>팀명</div>
            <div className={st.info_mid_size_text}>초대한 사람</div>
          </div>
          <div className={st.info_popup_v_line}></div>
          <div className={st.info_mid_size_text_space}>
            {/* <div className={st.info_test_text}>칠가이</div> */}
            {/* <div className={st.info_test_text}>발랄한 개구리</div> */}
            <div className={st.info_test_text}>{linkTeam.teamName}</div>
            <div className={st.info_test_text}>{linkTeam.leaderName}</div>
          </div>
        </div>

        <div className={st.info_popup_button_space}>
          <Button text={"확정"} type={"midBlue"} onClick={handleConfirm} />
          <Button text={"취소"} type={"midStroke"} onClick={handleCancel} />
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;
