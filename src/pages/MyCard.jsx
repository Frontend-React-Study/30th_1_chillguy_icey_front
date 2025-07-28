import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import CardList from "../components/Letter/CardList";
import CardModal from "../components/Modal/CardModal";
import Button from "../components/Button";
import AlertDialog from "../components/Dialog/AlertDialog";

import st from "./MyCard.module.css";

const MyCard = () => {
  // 토큰 불러오기
  const { token } = useAuth();
  const backLink = "https://icey-backend-1027532113913.asia-northeast3.run.app";

  // location: 현재 팀 정보 받기
  const [searchParams] = useSearchParams();
  const currentTeamId = searchParams.get("teamId");
  const currentTeamName = searchParams.get("teamName");

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
  // state: 내가 현재 팀에서 사용 중인 명함 ID
  const [currentCardIdInTeam, setCurrentCardIdInTeam] = useState(null);

  // 내 명함 목록 불러오기
  const fetchMyCards = async () => {
    try {
      const res = await axios.get(`${backLink}/api/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const cards = res.data;
      console.log("불러온 내 명함 목록:", cards);

      // 각 명함에 대해 사용 팀 목록 불러오기
      const cardsWithTeams = await Promise.all(
        cards.map(async (card) => {
          try {
            const teamRes = await axios.get(
              `${backLink}/api/cards/${card.templateId}/used-teams`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            return {
              ...card,
              teams: teamRes.data.map((team) => team.name),
            };
          } catch (teamErr) {
            console.error(
              `카드 ${card.cardId}의 팀 정보 불러오기 실패`,
              teamErr,
            );
            return {
              ...card,
              teams: [],
            };
          }
        }),
      );

      setCardList(cardsWithTeams);
    } catch (err) {
      console.error("내 명함 불러오기 실패", err);
    }
  };

  useEffect(() => {
    fetchMyCards();
    fetchCurrentTeamCard();
  }, [token, currentTeamId, currentTeamName]);

  // 현재 팀에서 내가 사용 중인 명함 ID 불러오기
  const fetchCurrentTeamCard = async () => {
    if (!currentTeamId || !token) return;
    try {
      const res = await axios.get(
        `${backLink}/api/cards/teams/${currentTeamId}/cards/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCurrentCardIdInTeam(res.data.cardId);
      console.log("내가 현재 팀에서 사용 중인 명함:", res.data);
    } catch (err) {
      console.error("현재 팀에서 내 명함 불러오기 실패", err);
      setCurrentCardIdInTeam(null);
    }
  };

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
      console.log("저장된 카드 정보:", newCardData);
      if (isEditMode && selectedCardId !== null) {
        // 수정 모드
        await axios.patch(
          `${backLink}/api/cards/${selectedCardId}`,
          newCardData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCardList((prev) =>
          prev.map((card) => {
            if (card.cardId === selectedCardId) {
              // 선택된 명함은 현재 팀으로 변경
              return { ...card, ...newCardData };
            } else {
              // 나머지 명함은 기존 teams 유지
              return card;
            }
          }),
        );
      } else {
        // 새 명함 저장
        const res = await axios.post(`${backLink}/api/cards`, newCardData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("서버 응답 데이터:", res.data);
        const newCard = { ...res.data, teams: [] };
        setCardList((prev) => [...prev, newCard]);
      }

      await fetchMyCards();
      await fetchCurrentTeamCard();

      closeModal();
    } catch (err) {
      console.error("명함 저장 실패", err);
    }
  };

  // 삭제 경고 dialog
  const openAlert = () => {
    if (selectedCardId === null) return;

    if (selectedCardId === currentCardIdInTeam) {
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
      await axios.delete(`${backLink}/api/cards/${selectedCardId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
      console.log("선택된 카드 ID:", cardIdToUse);
      const selectedCard = cardList.find((card) => card.cardId === cardIdToUse);
      console.log("선택된 카드:", selectedCard);

      if (!selectedCard) {
        console.warn("선택된 명함 정보를 찾을 수 없습니다.");
        return;
      }

      const { templateId } = selectedCard;
      console.log("보낼 쿼리 파라미터:", { templateId });

      try {
        await axios.put(
          `${backLink}/api/cards/teams/${currentTeamId}/cards/my-card`,
          null, // body 없음
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { templateId: selectedCard.templateId },
          },
        );

        await fetchMyCards();
        await fetchCurrentTeamCard();
      } catch (err) {
        console.error("팀에 명함 설정 실패", err);
      }
    },
    [cardList, currentTeamId, currentTeamName, token],
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
          teams
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
          currentCardId={currentCardIdInTeam}
        />
      </div>

      {/* 하단 버튼 영역 */}
      <div className={st.Fix_buttons_body}>
        {selectedCard && (
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
