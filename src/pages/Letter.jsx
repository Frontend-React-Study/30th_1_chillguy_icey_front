<<<<<<< Updated upstream
import ReceivedLetter from "../components/ReceivedLetter";
import CardList from "../components/CardList";
import Card from "../components/Card";
import "./Letter.css";

const Letter = () => {
  return (
    <div className="Letter-body">
      <div className="Letter-list">
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
        <ReceivedLetter />
      </div>
      <CardList>
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
        <Card />
      </CardList>
    </div>
=======
import { useEffect, useRef, useState } from "react";
import ReceivedLetter from "../components/Letter/ReceivedLetter";
import CardList from "../components/Letter/CardList";
import Button from "../components/Button";
import LetterModal from "../components/Modal/LetterModal";

import st from "./Letter.module.css";

import { useLetters } from "../hooks/useLetters";

const messages = [
  "쪽지 내용. 안녕하세요 처음 뵙겠습니다.",
  "식사 하셨어요? 안하셨다면 같이 어떠세요",
  "쪽지 내용. 안녕하세요 처음 뵙겠습니다.",
  "식사 하셨어요? 안하셨다면 같이 어떠세요",
  "쪽지 내용. 안녕하세요 처음 뵙겠습니다.",
  "식사 하셨어요? 안하셨다면 같이 어떠세요",
  "쪽지 내용. 안녕하세요 처음 뵙겠습니다.",
  "식사 하셨어요? 안하셨다면 같이 어떠세요",
  "쪽지 내용. 안녕하세요 처음 뵙겠습니다.",
  "식사 하셨어요? 안하셨다면 같이 어떠세요",
  "식사 하셨어요? 안하셨다면 같이 어떠세요",
];

const cards = [
  {
    name: "발랄한 고양이",
    mbti: "INFP",
    hobby: "산책",
    secret: "좋은 귀 기울이기",
    tmi: "커피 중독",
  },
  {
    name: "귀여운 강아지",
    mbti: "ESTJ",
    hobby: "축구",
    secret: "매일 운동하기",
    tmi: "밤샘 가능",
  },
  {
    name: "귀여운 강아지",
    mbti: "ESTJ",
    hobby: "축구",
    secret: "매일 운동하기",
    tmi: "밤샘 가능",
  },
  {
    name: "귀여운 강아지",
    mbti: "ESTJ",
    hobby: "축구",
    secret: "매일 운동하기",
    tmi: "밤샘 가능",
  },
];

const Letter = () => {
  // 총 쪽지 개수
  const totalLetters = 11;
  // useLetters hook : 읽음 여부, 토글 여부.
  const { openedIndex, readStatus, handleClick } = useLetters(totalLetters);

  // state: 모달 열림 상태
  const [modalOpen, setModalOpen] = useState(false);
  // state: 쪽지 보내기로 선택한 명함
  const [selectedCard, setSelectedCard] = useState(null);

  // ref: 실제 스크롤되는 영역(Letter_list)
  const letterListRef = useRef(null);
  // ref: 뷰포트 역할 컨테이너(Letter_body)
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

  // 선택된 쪽지를 Letter_body 뷰포트 기준 중앙에 위치시키기
  useEffect(() => {
    if (
      openedIndex === null ||
      !letterListRef.current ||
      !letterBodyRef.current ||
      !selectedSectionRef.current
    )
      return;

    const container = letterListRef.current; // 스크롤되는 컨테이너
    const viewport = letterBodyRef.current; // 실제 보이는 영역 (뷰포트)
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
                  Name={openedIndex}
                />
                <div className={st.Letter_contentBox}>
                  <div className={st.Letter_message}>
                    <div className={st.Letter_message_text}>
                      {messages[openedIndex]}
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
                  content={messages[i]}
                  onClick={() => handleClick(i)}
                  Name={i}
                />
              );
            })}
          </div>
          <CardList
            cards={cards}
            onSendClick={openModal}
            showSendButton={true}
          />
        </div>
      </div>
      {modalOpen && selectedCard && (
        <div onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <LetterModal card={selectedCard} onClose={closeModal} />
          </div>
        </div>
      )}
    </>
>>>>>>> Stashed changes
  );
};

export default Letter;
