import { useState } from "react";
import axios from "axios";

import Button from "../Button";
import st from "./LetterModal.module.css";

import modal_line from "../../assets/modal_line.svg";
import modal_line_vertical from "../../assets/modal_line_vertical.svg";
import { getAnimalImage } from "../../util/get-animal-image";
import exPig from "../../assets/exPig.png";

// Props
// card: 선택된 명함 정보
// onClose: 모달 닫기 함수
// onSend: 쪽지 내용 저장 함수

const LetterModal = ({ card, teamId, onClose, onSend, sender }) => {
  // state: 쪽지 본문 저장
  const [message, setMessage] = useState("");
  // state: 전송 중 상태 처리
  const [sending, setSending] = useState(false);
  // state: 에러 상태 처리
  const [error, setError] = useState(null);

  // 보내기 버튼 콜백 함수
  const handleSendClick = async () => {
    if (!message.trim()) return; // 빈 메시지 방지
    setSending(true);
    setError(null);

    try {
      await axios.post(`/api/teams/${teamId}/cards/${card.cardId}/letters`, {
        content: message,
      });
      onSend(message);
    } catch (e) {
      console.error("쪽지 전송 실패", e);
      setError("쪽지 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSending(false);
    }
  };
  // 동물 이미지 매핑
  const animalMap = {
    강아지: "dog",
    고양이: "cat",
    곰: "bear",
    개구리: "frog",
    돼지: "pig",
    토끼: "rabbit",
  };

  // 명함 이미지
  const animalKey = animalMap[card.animal] || null;
  const imageSrc =
    animalKey && card.profileColor
      ? getAnimalImage(animalKey, card.profileColor)
      : exPig;

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
            <div className={st.Card_Name}>
              {card.nickname} {card.animal}
            </div>
            <div className={st.Card_Wrapper}>
              <div className={st.Card_image}>
                <img
                  src={imageSrc}
                  alt={`${card.animal} image`}
                  onError={(e) => {
                    e.currentTarget.src = exPig; // 로딩 실패 시 예시 이미지 나중에 수정
                  }}
                />
              </div>
              <div className={st.Card_info}>
                <div className={st.InfoLabel}>MBTI: {card.mbti}</div>
                <div className={st.InfoLabel}>취미: {card.hobby}</div>
                <div className={st.InfoLabel}>
                  친해지는 비법: {card.secretTip}
                </div>
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
                <div className={st.Info_text}>
                  {sender.nickname} {sender.animal}
                </div>
              </div>
              <div className={st.Receive_wrapper}>
                <div className={st.Info_text_title}>받는 사람</div>
                <img
                  className={st.Line_vertical}
                  src={modal_line_vertical}
                  alt="modal_line_vertical"
                />
                <div className={st.Info_text}>
                  {card.nickname} {card.animal}
                </div>
              </div>
            </div>

            {/* 쪽지 작성 textarea */}
            <div className={st.Write_letter}>
              <textarea
                className={st.Write_text}
                value={message}
                placeholder="쪽지 작성.."
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
              />
            </div>
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className={st.Confirm_buttons}>
          <Button
            text={sending ? "전송 중..." : "보내기"}
            type={"midBlue"}
            onClick={handleSendClick}
            disabled={sending}
          />
          <Button text={"취소"} type={"midStroke"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default LetterModal;
