import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import CardList from "../components/Letter/CardList";
import CardModal from "../components/Modal/CardModal";
import Button from "../components/Button";
import AlertDialog from "../components/Dialog/AlertDialog";

import st from "./MyCard.module.css";

const MyCard = () => {
  // location: 현재 팀 정보 받기
  const location = useLocation();
  const team = location.state || { id: 0, name: "테스트팀" };

  // state: 명함 추가 모달 열림 상태
  const [modalOpen, setModalOpen] = useState(false);
  // state: 명함 수정 모달 열림 상태
  const [isEditMode, setIsEditMode] = useState(false);
  // state: 수정할 카드 선택
  const [selectedCardId, setSelectedCardId] = useState(null);

  // state: 삭제 경고 알림
  const [alertOpen, setAlertOpen] = useState(false);
  // state: 경고 알림 dialog 설정
  const [alertDialogConfig, setAlertDialogConfig] = useState({
    mainText: "",
    subText: "",
    confirmText: "",
    confirmType: "",
  });

  // state: cards 상태 업데이트용
  const [cardList, setCardList] = useState([]);

  const currentTeamId = team.id;
  const currentTeamName = team.name;

  useEffect(() => {
    // 모든 명함 & 현재 팀에서 사용 중인 명함 불러오기
    const fetchCards = async () => {
      try {
        const [allRes, usedRes] = await Promise.all([
          axios.get("/api/cards"),
          axios.get(`/api/cards/teams/${currentTeamId}/cards`),
        ]);

        const usedCardIds = usedRes.data.map((card) => card.cardId);
        const updatedCards = allRes.data.map((card) => ({
          ...card,
          teams: usedCardIds.includes(card.cardId) ? [currentTeamName] : [],
        }));

        setCardList(updatedCards);
      } catch (err) {
        console.error("명함 목록 불러오기 실패", err);
      }
    };

    fetchCards();
  }, [currentTeamId, currentTeamName]);

  // 모달 열기/닫기 함수
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // "명함 추가하기" 모달
  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedCardId(null);
    setModalOpen(true);
  };

  // "명함 수정하기" 모달
  const openEditModal = (cardId) => {
    setSelectedCardId(cardId);
    setIsEditMode(true);
    setModalOpen(true);
  };

  // 명함 저장 함수
  const handleSaveCard = async (newCardData) => {
    try {
      if (isEditMode && selectedCardId !== null) {
        await axios.patch(`/api/cards/${selectedCardId}`, newCardData);
        setCardList((prev) =>
          prev.map((card) =>
            card.cardId === selectedCardId ? { ...card, ...newCardData } : card,
          ),
        );
      } else {
        const res = await axios.post("/api/cards", newCardData);
        const newCard = { ...res.data, teams: [] };
        setCardList((prev) => [...prev, newCard]);
      }
      closeModal();
    } catch (err) {
      console.error("명함 저장 실패", err);
    }
  };

  // 삭제 경고 dialog
  const openAlert = () => {
    if (selectedCardId === null) return;

    const selectedCard = cardList.find((c) => c.cardId === selectedCardId);
    if (selectedCard?.teams?.includes(currentTeamName)) {
      setAlertDialogConfig({
        mainText: "현재 사용 중인 명함입니다.",
        subText: "명함 교체 후 삭제 가능합니다.",
        confirmText: "확인",
        confirmType: "midBlue",
      });
    } else {
      setAlertDialogConfig({
        mainText: "명함을 삭제하시겠습니까?",
        subText: "삭제하면 다시 복구할 수 없습니다.",
        confirmText: "삭제",
        confirmType: "midRed",
      });
    }

    setAlertOpen(true);
  };

  // AlertDialog 닫는 함수
  const closeAlert = () => setAlertOpen(false);

  // 명함 삭제 함수
  const handleDeleteCard = async () => {
    try {
      await axios.delete(`/api/cards/${selectedCardId}`);
      setCardList((prev) => prev.filter((c) => c.cardId !== selectedCardId));
      setSelectedCardId(null);
      setAlertOpen(false);
    } catch (err) {
      console.error("명함 삭제 실패", err);
    }
  };

  // 팀 선택 핸들러
  const handleSelectTeam = useCallback(
    async (cardIdToUse) => {
      try {
        await axios.put(`/api/cards/teams/${currentTeamId}/cards/my-card`, {
          cardId: cardIdToUse,
        });

        // team 바인딩 갱신
        setCardList((prev) =>
          prev.map((card) => ({
            ...card,
            teams: card.cardId === cardIdToUse ? [currentTeamName] : [],
          })),
        );
      } catch (err) {
        console.error("팀에 명함 설정 실패", err);
      }
    },
    [currentTeamId, currentTeamName],
  );

  // 현재 선택된 명함 정보를 가져온다.
  const selectedCard =
    cardList.find((card) => card.cardId === selectedCardId) || null;

  return (
    <>
      <div className={st.Card_body}>
        {/* 타이틀 */}
        <div className={st.TitleSection}>
          <div className={st.Title}>나의 명함 보기</div>
          <div className={st.SubTitle}>Card Category</div>
        </div>

        {/* 명함 리스트 */}
        <CardList
          cards={cardList}
          onSendClick={openModal}
          onAddClick={openAddModal}
          showSendButton={false}
          showAddButton={true}
          selectable={true}
          selectedCardId={selectedCardId}
          onCardClick={(id) => {
            setSelectedCardId((prev) => (prev === id ? null : id));
          }}
          currentTeamName={currentTeamName}
          onSelectTeam={handleSelectTeam}
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className={st.Fix_buttons_body}>
        {selectedCardId !== null && (
          <div className={st.Fix_buttons}>
            <Button
              text={"수정하기"}
              type={"mid"}
              onClick={() => openEditModal(selectedCardId)}
            />
            <Button text={"삭제하기"} type={"mid"} onClick={openAlert} />
          </div>
        )}
      </div>

      {/* 카드 추가/수정 CardModal */}
      {modalOpen && (
        <div onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <CardModal
              onClose={closeModal}
              onSave={handleSaveCard}
              mainTitle={isEditMode ? "명함 수정하기" : "명함 추가하기"}
              subTitle={isEditMode ? "Edit card" : "Add card"}
              defaultValue={selectedCard}
            />
          </div>
        </div>
      )}

      {/* 삭제 경고 AlertDialog */}
      {alertOpen && (
        <div onClick={closeAlert}>
          <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog
              mainText={alertDialogConfig.mainText}
              subText={alertDialogConfig.subText}
              confirmText={alertDialogConfig.confirmText}
              confirmType={alertDialogConfig.confirmType}
              onConfirm={handleDeleteCard}
              onCancel={closeAlert}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MyCard;
