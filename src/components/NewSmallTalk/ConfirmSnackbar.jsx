import st from "./ConfirmSnackbar.module.css";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

const ConfirmSnackbar = ({
  onClick,
  onClose,
  smallTalk: initialSmallTalkData,
}) => {
  const navigate = useNavigate();

  // onClickSmall 함수는 현재 컴포넌트 JSX에서 사용되지 않으므로, 필요 없으면 제거해도 됩니다.
  // const onClickSmall = (e) => {
  //   navigate("/editsmall", { state: { refresh: true } });
  // };

  return (
    <div className={st.overlay} onClick={onClose}>
      {/* 팝업 내부 클릭 시 모달이 닫히지 않도록 이벤트 전파를 중지합니다. */}
      <div className={st.popup} onClick={(e) => e.stopPropagation()}>
        <div className={st.text}>작성한 내용으로 스몰톡을 생성할까요?</div>
        <div className={st.button_frame}>
          <Button
            text={"확인"}
            type={"midBlue"}
            onClick={async () => {
              try {
                // 'onClick' prop으로 전달된 함수는 스몰톡을 생성하고 그 결과를 반환해야 합니다.
                const createdSmallTalk = await onClick();

                // 스몰톡 생성 함수가 유효한 데이터를 반환했는지 확인합니다.
                if (createdSmallTalk) {
                  console.log("스몰톡 생성 성공:", createdSmallTalk);
                  onClose(); // 스낵바를 닫습니다.
                  navigate("/editsmall", {
                    state: { smallTalk: createdSmallTalk }, // 생성된 스몰톡 데이터를 state로 전달합니다.
                  });
                } else {
                  // 생성 함수가 데이터를 반환하지 않았을 경우 사용자에게 알립니다.
                  alert(
                    "스몰톡 생성에 실패했습니다: 반환된 데이터가 없습니다.",
                  );
                  console.error(
                    "스몰톡 생성 실패: onClick 함수가 유효한 데이터를 반환하지 않았습니다.",
                  );
                }
              } catch (err) {
                console.error("스몰톡 생성 중 에러 발생:", err);
                // 에러 발생 시 사용자에게 알림 메시지를 표시합니다.
                alert("스몰톡 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
              }
            }}
          />

          <Button text={"취소"} type={"midStroke"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ConfirmSnackbar;
