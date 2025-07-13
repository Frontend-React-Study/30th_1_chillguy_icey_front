import { useState } from "react";

import CardList from "../components/Letter/CardList";
import CardModal from "../components/Modal/CardModal";
import Button from "../components/Button";
import AlertDialog from "../components/Dialog/AlertDialog";

import st from "./MyCard.module.css";

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
    name: "조용한 개구리",
    mbti: "ISTP",
    hobby: "영화보기",
    secret: "책 선물하기",
    tmi: "높이 뛰기 잘함",
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
const teamsData = [
  ["칠가이", "팀A", "팀B"],
  ["팀X"],
  [],
  ["팀Y", "팀Z"],
  ["팀Y", "팀Z"],
];

const MyCard = () => {
  // state: 명함 추가 모달 열림 상태
  const [modalOpen, setModalOpen] = useState(false);
  // state: 명함 수정 모달 열림 상태
  const [isEditMode, setIsEditMode] = useState(false);
  // state: 수정할 카드 선택
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  // state: 삭제 경고 알림
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDialogConfig, setAlertDialogConfig] = useState({
    mainText: "",
    subText: "",
    confirmText: "삭제",
    confirmType: "midRed",
  });

  // 모달 열기/닫기 함수
  const openModal = () => {
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  // "명함 추가하기" 모달
  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedCardIndex(null);
    setModalOpen(true);
  };

  // "명함 수정하기" 모달
  const openEditModal = (card) => {
    setIsEditMode(true);
    setModalOpen(true);
  };

  // 삭제 경고 dialog
  const openAlert = () => {
    const selectedTeams = teamsData[selectedCardIndex] || [];

    if (selectedTeams.length > 0) {
      // 사용 중인 명함인 경우
      setAlertDialogConfig({
        mainText: "현재 사용 중인 명함입니다.",
        subText: "명함 교체 후 삭제 가능합니다.",
        confirmText: "확인",
        confirmType: "midBlue",
      });
    } else {
      // 일반 삭제
      setAlertDialogConfig({
        mainText: "명함을 삭제하시겠습니까?",
        subText: "삭제하면 다시 복구할 수 없습니다.",
        confirmText: "삭제",
        confirmType: "midRed",
      });
    }

    setAlertOpen(true);
  };

  const closeAlert = () => {
    setAlertOpen(false);
  };

  const selectedCard =
    selectedCardIndex !== null ? cards[selectedCardIndex] : null;

  return (
    <>
      <div className={st.Card_body}>
        <div className={st.TitleSection}>
          <div className={st.Title}>나의 명함 보기</div>
          <div className={st.SubTitle}>Card Category</div>
        </div>
        <CardList
          cards={cards}
          onSendClick={openModal}
          onAddClick={openAddModal}
          showAddButton={true}
          showSendButton={false}
          teamsData={teamsData}
          selectable={true}
          selectedCardIndex={selectedCardIndex}
          onCardClick={(index) => {
            if (selectedCardIndex === index) {
              setSelectedCardIndex(null); // 이미 선택된 카드면 해제
            } else {
              setSelectedCardIndex(index); // 아니면 선택
            }
          }}
        />
      </div>
      <div className={st.Fix_buttons_body}>
        {selectedCardIndex !== null && (
          <div className={st.Fix_buttons}>
            <Button text={"수정하기"} type={"mid"} onClick={openEditModal} />
            <Button text={"삭제하기"} type={"mid"} onClick={openAlert} />
          </div>
        )}
      </div>

      {modalOpen && (
        <div onClick={closeModal}>
          <div onClick={(e) => e.stopPropagation()}>
            <CardModal
              onClose={closeModal}
              mainTitle={isEditMode ? "명함 수정하기" : "명함 추가하기"}
              subTitle={isEditMode ? "Edit card" : "Add card"}
              defaultValue={selectedCard}
            />
          </div>
        </div>
      )}

      {alertOpen && (
        <div onClick={closeAlert}>
          <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog
              mainText={alertDialogConfig.mainText}
              subText={alertDialogConfig.subText}
              confirmText={alertDialogConfig.confirmText}
              confirmType={alertDialogConfig.confirmType}
              onConfirm={() => {
                // 삭제 또는 확인 후 처리
                closeAlert();
              }}
              onCancel={closeAlert}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MyCard;
