import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import ReceivedLetter from "../components/Letter/ReceivedLetter";
import CardList from "../components/Letter/CardList";
import Button from "../components/Button";
import LetterModal from "../components/Modal/LetterModal";
import Snackbar from "../components/Snackbar/Snackbar";

import st from "./Letter.module.css";

const Letter = () => {
  // location : 현재 사용 중인 팀 데이터 받아오기
  const location = useLocation();
  const team = location.state || { id: 0, name: "테스트팀" };

  // state: 열려있는 쪽지
  const [openedId, setOpenedId] = useState(null);
  // state: 쪽지 내용
  const [letters, setLetters] = useState([]);
  // state: 모달 열림 상태
  const [modalOpen, setModalOpen] = useState(false);
  // state: 쪽지 보내기로 선택한 명함
  const [selectedCard, setSelectedCard] = useState(null);
  // state: 쪽지 전송 완료 snackbar 상태
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // state: 명함 추가
  const [cards, setCards] = useState([]);

  // ref: 실제 스크롤되는 영역(Letter_list)
  const letterListRef = useRef(null);
  // ref: 뷰포트 역할 요소(Letter_body)
  const letterBodyRef = useRef(null);
  // ref: 선택된 쪽지+내용 영역(Selected_section)
  const selectedSectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 쪽지 목록 불러오기
        const lettersRes = await axios.get(
          `/api/teams/${team.id}/letters/received`,
        );
        setLetters(lettersRes.data?.data || []);

        // 팀 명함 목록 불러오기
        const cardsRes = await axios.get(`/api/cards/teams/${team.id}/cards`);
        setCards(cardsRes.data || []); // 필요 시 cardsRes.data.data로 수정
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      }
    };

    fetchData();
  }, [team.id]);

  // 쪽지 클릭 시 내용 불러오기
  const handleClick = async (letterId) => {
    if (openedId === letterId) {
      setOpenedId(null);
      return;
    }

    try {
      const res = await axios.get(`/api/teams/${team.id}/letters/${letterId}`);
      const content = res.data?.data?.content || "";

      setLetters((prev) =>
        prev.map((l) =>
          l.id === letterId ? { ...l, content, isRead: true } : l,
        ),
      );
      setOpenedId(letterId);
    } catch (err) {
      console.error("쪽지 내용 불러오기 실패", err);
    }
  };

  // 확인 버튼 클릭 시 쪽지 내용 닫기
  const handleCloseContent = () => {
    handleClick(openedId);
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
  const handleSendLetter = async (message) => {
    try {
      await axios.post(
        `/api/teams/${team.id}/cards/${selectedCard.cardId}/letters`,
        {
          content: message,
        },
      );

      closeModal();
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 3000);
    } catch (error) {
      console.error("쪽지 전송 실패", error);
      alert("쪽지 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 선택된 쪽지를 Letter_body 뷰포트 기준 중앙에 위치시키기
  useEffect(() => {
    if (
      openedId === null ||
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
  }, [openedId]);

  const selectedLetter = letters.find((l) => l.id === openedId);

  return (
    <>
      <div className={st.Letter_wrapper}>
        <div ref={letterBodyRef} className={st.Letter_body}>
          <div
            ref={letterListRef}
            className={`${st.Letter_list} ${
              openedId !== null ? st.Letter_list_expanded : ""
            }`}
          >
            {/* 선택된 쪽지 + 내용 묶음 */}
            {openedId !== null && selectedLetter && (
              <div ref={selectedSectionRef} className={st.Selected_section}>
                <ReceivedLetter
                  isOpen={true}
                  isRead={selectedLetter.isRead}
                  onClick={() => handleClick(openedId)}
                  isSelected={true}
                  name={selectedLetter.senderName}
                />
                <div className={st.Letter_contentBox}>
                  <div className={st.Letter_message}>
                    <div className={st.Letter_message_text}>
                      {selectedLetter.content}
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
            {letters.map((letter) => {
              if (letter.id === openedId) return null;
              return (
                <ReceivedLetter
                  key={letter.id}
                  isOpen={letter.id === openedId}
                  isRead={letter.isRead}
                  onClick={() => handleClick(letter.id)}
                  name={letter.senderName}
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
              teamId={team.id}
              onClose={closeModal}
              onSend={handleSendLetter}
              // sender={user}   // 여기 받는 걸로 수정
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
