import { useState } from "react";
import modal_line from "../../assets/modal_line.svg";
import modal_line_vertical from "../../assets/modal_line_vertical.svg";
import Button from "../Button";
import st from "./LetterModal.module.css";

// Props
// card: 선택된 명함 정보
// onClose: 모달 닫기 함수
// onSend: 쪽지 내용 저장 함수

const LetterModal = ({ card, onClose, onSend }) => {
  // state: 쪽지 본문 저장
  const [message, setMessage] = useState("");

  // 보내기 버튼 콜백 함수
  const handleSendClick = () => {
    if (!message.trim()) return; // 빈 메시지 방지
    onSend(message);
  };

  return (
    <div className={st.Overlay}>
      {/* 모달 전체 컨테이너 */}
      <div className={st.LetterModal}>
        {/* 타이틀 */}
        <div className={st.Title_wrapper}>
          <div className={st.Title}>
            <div className={st.Main_title}>쪽지 작성하기</div>
            <div className={st.Sub_title}>Write letter</div>
          </div>
          <img className={st.Line} src={modal_line} alt="modal_line" />
        </div>

        {/* 명함 + 쪽지 작성 */}
        <div className={st.Letter_wrapper}>
          {/* 수신자 명함 정보 */}
          <div className={st.Card}>
            <div className={st.Card_Name}>{card.name}</div>
            <div className={st.Card_Wrapper}>
              <div className={st.Card_image}></div>
              <div className={st.Card_info}>
                <div className={st.InfoLabel}>MBTI: {card.mbti}</div>
                <div className={st.InfoLabel}>취미: {card.hobby}</div>
                <div className={st.InfoLabel}>친해지는 비법: {card.secret}</div>
                <div className={st.InfoLabel}>TMI: {card.tmi}</div>
              </div>
            </div>
          </div>

          {/* 쪽지 작성 */}
          <div className={st.Write_body}>
            {/* 발신자, 수신자 정보 표시 */}
            <div className={st.Info}>
              <div className={st.Send_wrapper}>
                <div className={st.Info_text_title}>보내는 사람</div>
                <img
                  className={st.Line_vertical}
                  src={modal_line_vertical}
                  alt="modal_line_vertical"
                />
                <div className={st.Info_text}>발랄한 고양이</div>
              </div>
              <div className={st.Receive_wrapper}>
                <div className={st.Info_text_title}>받는 사람</div>
                <img
                  className={st.Line_vertical}
                  src={modal_line_vertical}
                  alt="modal_line_vertical"
                />
                <div className={st.Info_text}>{card.name}</div>
              </div>
            </div>

            {/* 쪽지 작성 textarea */}
            <div className={st.Write_letter}>
              <textarea
                className={st.Write_text}
                value={message}
                placeholder="쪽지 작성.."
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={st.Confirm_buttons}>
          <Button text={"보내기"} type={"midBlue"} onClick={handleSendClick} />
          <Button text={"취소"} type={"midStroke"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default LetterModal;
