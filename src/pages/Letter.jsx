import { useEffect, useRef, useState } from "react";
import ReceivedLetter from "../components/Letter/ReceivedLetter";
import CardList from "../components/Letter/CardList";
import Button from "../components/Button";
import LetterModal from "../components/Modal/LetterModal";
import Snackbar from "../components/Snackbar/Snackbar";

import st from "./Letter.module.css";

import { useLetters } from "../hooks/useLetters";
import { cards } from "../util/card-info";
import { messages } from "../util/letter-message";

const Letter = () => {
  // 총 쪽지 개수
  const totalLetters = messages.length;
  // hook: 열려있는 쪽지, 각 쪽지의 읽음 여부
  const { openedIndex, readStatus, handleClick } = useLetters(totalLetters);

  // state: 모달 열림 상태
  const [modalOpen, setModalOpen] = useState(false);
  // state: 쪽지 보내기로 선택한 명함
  const [selectedCard, setSelectedCard] = useState(null);
  // state: 쪽지 내용 저장
  const [sentLetters, setSentLetters] = useState([]);
  // state: 쪽지 전송 완료 snackbar 상태
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // ref: 실제 스크롤되는 영역(Letter_list)
  const letterListRef = useRef(null);
  // ref: 뷰포트 역할 요소(Letter_body)
  const letterBodyRef = useRef(null);
  // ref: 선택된 쪽지+내용 영역(Selected_section)
  const selectedSectionRef = useRef(null);

  // 확인 버튼 클릭 시 쪽지 내용 닫기
  const handleCloseContent = () => {
    handleClick(openedIndex);
  };

  // 모달 열기/닫기 함수
  const openModal = (cardData) => {
    setSelectedCard(cardData);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setSelectedCard(null); // 닫을 때 초기화
  };

  // Snackbar 닫기 함수
  const handleSnackbarClose = () => setSnackbarOpen(false);

  // 쪽지 전송 함수
  const handleSendLetter = (message) => {
    const newLetter = {
      recipient: selectedCard.name,
      content: message,
      timestamp: new Date().toISOString(), // 시간 기록
    };

    // 쪽지 저장 로직
    setSentLetters((prev) => [...prev, newLetter]);
    closeModal();

    // 전송 완료 알림 띄우기
    setSnackbarOpen(true);

    // 일정 시간 후 자동 snackbar 닫기
    setTimeout(() => setSnackbarOpen(false), 3000);
  };

  // 선택된 쪽지를 Letter_body 뷰포트 기준 중앙에 위치시키기
  useEffect(() => {
    if (
      openedIndex === null ||
      !letterListRef.current ||
      !letterBodyRef.current ||
      !selectedSectionRef.current
    )
      return;

    const container = letterListRef.current; // 스크롤 가능한 div
    const viewport = letterBodyRef.current; // 실제 보이는 영역
    const target = selectedSectionRef.current; // 선택된 쪽지+내용

    // 선택된 요소의 중앙 좌표 (Letter_list 컨테이너 기준)
    const targetCenter = target.offsetLeft + target.clientWidth / 2;

    // Letter_body (뷰포트) 너비의 중앙
    const viewportCenter = viewport.clientWidth / 2;

    // 스크롤 위치 계산: 선택된 쪽지의 중앙을 뷰포트 중앙에 맞춤
    const scrollLeft = targetCenter - viewportCenter;

    container.scrollTo({ left: scrollLeft, behavior: "smooth" });
  }, [openedIndex]);

  return (
    <>
      <div className={st.Letter_wrapper}>
        <div ref={letterBodyRef} className={st.Letter_body}>
          <div
            ref={letterListRef}
            className={`${st.Letter_list} ${
              openedIndex !== null ? st.Letter_list_expanded : ""
            }`}
          >
            {/* 선택된 쪽지 + 내용 묶음 */}
            {openedIndex !== null && (
              <div ref={selectedSectionRef} className={st.Selected_section}>
                <ReceivedLetter
                  isOpen={true}
                  isRead={readStatus[openedIndex]}
                  onClick={() => handleClick(openedIndex)}
                  isSelected={true}
                  name={messages[openedIndex]?.sender}
                />
                <div className={st.Letter_contentBox}>
                  <div className={st.Letter_message}>
                    <div className={st.Letter_message_text}>
                      {messages[openedIndex]?.content}
                    </div>
                  </div>
                  <Button
                    text={"확인"}
                    type={"mid"}
                    onClick={handleCloseContent}
                  />
                </div>
              </div>
            )}
            {/* 선택된 쪽지 제외한 나머지 쪽지들 */}
            {Array.from({ length: totalLetters }, (_, i) => {
              if (i === openedIndex) return null;
              return (
                <ReceivedLetter
                  key={i}
                  isOpen={openedIndex === i}
                  isRead={readStatus[i]}
                  content={messages[i]?.content}
                  onClick={() => handleClick(i)}
                  name={messages[i]?.sender}
                />
              );
            })}
          </div>

          {/* 명함 리스트 */}
          <CardList
            cards={cards}
            onSendClick={openModal}
            showSendButton={true}
          />
        </div>
      </div>
      {/* 쪽지 작성 모달 LetterModal */}
      {modalOpen && selectedCard && (
        <div onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <LetterModal
              card={selectedCard}
              onClose={closeModal}
              onSend={handleSendLetter}
            />
          </div>
        </div>
      )}

      {snackbarOpen && (
        <Snackbar
          text={"쪽지 보내기를 완료했습니다!"}
          buttontext={"확인"}
          buttonOnclick={handleSnackbarClose}
        />
      )}
    </>
  );
};

export default Letter;
