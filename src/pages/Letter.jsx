import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ReceivedLetter from "../components/Letter/ReceivedLetter";
import CardList from "../components/Letter/CardList";
import Button from "../components/Button";
import LetterModal from "../components/Modal/LetterModal";
import Snackbar from "../components/Snackbar/Snackbar";

import st from "./Letter.module.css";

import {
  fetchReceivedLetters,
  fetchLetterContent,
} from "../util/LetterDataAPI";
import { fetchTeamCards, fetchCurrentTeamCard } from "../util/CardDataAPI";

const Letter = () => {
  // 현재 팀 정보 받기
  const [searchParams] = useSearchParams();
  const currentTeamId = searchParams.get("teamId");

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
  // state: 쪽지 발신자 이름
  const [myNickname, setMyNickname] = useState("");
  // state: 현재 사용자 카드 아이디
  const [myCardId, setMyCardId] = useState(null);

  // ref: 실제 스크롤되는 영역(Letter_list)
  const letterListRef = useRef(null);
  // ref: 뷰포트 역할 요소(Letter_body)
  const letterBodyRef = useRef(null);
  // ref: 선택된 쪽지+내용 영역(Selected_section)
  const selectedSectionRef = useRef(null);

  useEffect(() => {
    if (!currentTeamId) return;
    const fetchData = async () => {
      try {
        // 쪽지 목록 불러오기
        const fetchedLetters = await fetchReceivedLetters(currentTeamId);
        setLetters(fetchedLetters);

        const fetchedCards = await fetchTeamCards(currentTeamId);
        const myCard = await fetchCurrentTeamCard(currentTeamId);

        if (myCard && myCard.nickname) {
          setMyNickname(myCard.nickname);
          setMyCardId(myCard.cardId);

          // 여기서 내 명함을 제외한 카드만 저장
          const filteredCards = fetchedCards.filter(
            (card) => card.cardId !== myCard.cardId,
          );
          setCards(filteredCards);
        } else {
          console.warn(
            "현재 팀에서 사용 중인 내 명함 정보를 불러올 수 없습니다.",
          );
          setMyNickname("");
          setMyCardId(null);

          // 필터링 없이 전체 카드 저장
          setCards(fetchedCards);
        }
      } catch (err) {
        console.error("데이터 불러오기 실패", err);
      }
    };
    fetchData();
  }, [currentTeamId]);

  // 쪽지 클릭 시 내용 불러오기
  const handleClick = async (letterId) => {
    if (!currentTeamId) return;
    if (openedId === letterId) {
      setOpenedId(null);
      return;
    }
    try {
      const content = await fetchLetterContent(currentTeamId, letterId);
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
    setSelectedCard(null);
  };

  // Snackbar 닫기 함수
  const handleSnackbarClose = () => setSnackbarOpen(false);

  // 선택된 쪽지를 Letter_body 뷰포트 기준 중앙에 위치시키기
  useEffect(() => {
    if (
      openedId === null ||
      !letterListRef.current ||
      !letterBodyRef.current ||
      !selectedSectionRef.current
    )
      return;

    const container = letterListRef.current;
    const viewport = letterBodyRef.current;
    const target = selectedSectionRef.current;

    const targetCenter = target.offsetLeft + target.clientWidth / 2;
    const viewportCenter = viewport.clientWidth / 2;
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
            cards={cards.filter((card) => card.cardId !== myCardId)}
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
              teamId={currentTeamId}
              onClose={closeModal}
              sender={myNickname}
              onSendSuccess={() => {
                setModalOpen(false);
                setSelectedCard(null);
                setSnackbarOpen(true);
              }}
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
