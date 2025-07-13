import { useState } from "react";

// initialLength : 쪽지 개수 초기화.
export function useLetters(initialLength = 0) {
  // 쪽지 토글
  // openedIndex : 열려있는 쪽지의 index
  // null : 아무 쪽지도 열려있지 않음
  // 숫자 : 인덱스 "숫자" 쪽지가 열려 있음
  const [openedIndex, setOpenedIndex] = useState(null);

  // readStatus : 각 쪽지의 읽음 여부
  // true : 읽은 쪽지
  // false : 안읽은 쪽지
  const [readStatus, setReadStatus] = useState(
    Array(initialLength).fill(false),
  );

  // 쪽지를 클릭했을 때 동작
  const handleClick = (index) => {
    // 클릭한 쪽지 토글
    setOpenedIndex((prevIndex) => (prevIndex === index ? null : index));

    // 클릭한 쪽지를 읽음으로 표시
    setReadStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = true;
      return newStatus;
    });
  };

  return {
    openedIndex,
    readStatus,
    handleClick,
  };
}
