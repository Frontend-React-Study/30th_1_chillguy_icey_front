import { useState, useEffect, useRef } from "react";
import Button from "../Button";
import st from "./Question.module.css";

// Question 컴포넌트: API에서 생성된 질문을 표시하고, 상세 내용, 팁, 삭제, 바꾸기 기능을 제공합니다.
function Question({
  id,
  text,
  initialDetailText,
  tipText,
  onDelete,
  onReplaceClick,
  disableReplaceButton,
  onDetailTextChange,
}) {
  // 상세 내용 및 팁 영역 표시 여부 상태
  const [showTipsAndCcc, setShowTipsAndCcc] = useState(false);
  // 상세 내용 텍스트 상태 (편집 가능)
  const [detailText, setDetailText] = useState(initialDetailText || "");
  // 상세 내용 편집 모드 여부 상태
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  // 팁 상세 내용 표시 여부 상태
  const [showTipDetail, setShowTipDetail] = useState(false);

  // 컴포넌트의 외부 클릭 감지를 위한 ref
  const containerRef = useRef(null);
  // textarea의 자동 높이 조절을 위한 ref
  const textareaRef = useRef(null);

  // textarea의 높이를 내용에 맞게 자동으로 조절하는 함수
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // 높이 초기화
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px"; // 스크롤 높이에 맞게 설정
    }
  };

  // detailText나 isEditingDetail 상태가 변경될 때마다 textarea 높이 조절
  useEffect(() => {
    if (isEditingDetail) {
      adjustTextareaHeight();
    }
  }, [detailText, isEditingDetail]);

  // initialDetailText가 변경되면 detailText도 업데이트 (외부에서 prop 변경 시)
  useEffect(() => {
    setDetailText(initialDetailText || "");
  }, [initialDetailText]);

  // 컴포넌트 외부 클릭 시 팝업/편집 모드를 종료하는 useEffect
  useEffect(() => {
    const handleClickOutside = (e) => {
      // 팁 및 상세 내용 영역이 열려 있고, 클릭된 요소가 컴포넌트 내부에 포함되지 않을 때
      if (
        showTipsAndCcc &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        // 편집 모드였다면, 변경 사항을 부모에게 알리고 편집 모드 종료
        if (isEditingDetail && onDetailTextChange) {
          onDetailTextChange(id, detailText);
        }
        setIsEditingDetail(false); // 편집 모드 종료
        setShowTipsAndCcc(false); // 상세 내용 및 팁 영역 숨기기
        setShowTipDetail(false); // 팁 상세 내용 숨기기
      }
    };
    // 문서 전체에 클릭 이벤트 리스너 추가
    document.addEventListener("click", handleClickOutside);
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showTipsAndCcc, isEditingDetail, id, detailText, onDetailTextChange]); // 의존성 배열에 추가

  // 메인 질문 영역 클릭 시 상세 내용/팁 영역 토글
  const handleMainClick = () => {
    setShowTipsAndCcc((prev) => {
      // 닫힐 때만 변경 사항 저장
      if (prev && isEditingDetail && onDetailTextChange) {
        onDetailTextChange(id, detailText);
      }
      return !prev;
    });
    setIsEditingDetail(false); // 상세 내용 영역 클릭 시 편집 모드 초기화
  };

  return (
    <div
      className={st.questionCard}
      onClick={handleMainClick}
      ref={containerRef}
      style={{ cursor: "pointer" }}
    >
      <div className={st.questionCardHeader}>
        {/* 질문 텍스트 */}
        <div className={st.questionText}>{text}</div>
        <div className={st.questionActions}>
          {/* 바꾸기 버튼: 클릭 시 onReplaceClick 호출, disableReplaceButton prop에 따라 활성화/비활성화 */}
          <Button
            text={"바꾸기"}
            // disableReplaceButton 값에 따라 버튼의 type을 변경합니다.
            type={disableReplaceButton ? "disabledReplace" : "blue"}
            onClick={(e) => {
              e.stopPropagation(); // 부모 div의 클릭 이벤트 전파 방지
              if (onReplaceClick) onReplaceClick(id); // onReplaceClick 함수 호출 시 해당 질문의 id 전달
            }}
            disabled={disableReplaceButton} // prop에 따라 버튼 비활성화
          />
          {/* 삭제 버튼: 클릭 시 onDelete 호출 */}
          <Button
            text={"삭제"}
            type={"bred"}
            onClick={(e) => {
              e.stopPropagation(); // 부모 div의 클릭 이벤트 전파 방지
              if (onDelete) onDelete(id); // onDelete 함수 호출 시 해당 질문의 id 전달
            }}
          />
        </div>
      </div>

      {/* 상세 내용 및 팁 영역 (showTipsAndCcc 상태에 따라 조건부 렌더링) */}
      {showTipsAndCcc && (
        <div className={st.questionDetailSection}>
          <div className={st.questionDetailCard}>
            {/* 상세 내용 영역: 클릭 시 편집 모드 전환 */}
            <div
              className={st.detailContentText}
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 방지
                setIsEditingDetail(true); // 편집 모드 활성화
              }}
              style={{ cursor: "text" }} // 텍스트 편집 가능함을 시각적으로 나타냄
            >
              {isEditingDetail ? (
                // 편집 모드일 때 textarea 렌더링
                <textarea
                  ref={textareaRef}
                  value={detailText}
                  onChange={(e) => setDetailText(e.target.value)}
                  onBlur={() => {
                    // textarea 포커스 잃었을 때 저장
                    setIsEditingDetail(false);
                    if (onDetailTextChange) {
                      onDetailTextChange(id, detailText);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()} // textarea 클릭 시 부모 클릭 이벤트 전파 방지
                  spellCheck={false}
                />
              ) : (
                // 읽기 모드일 때 텍스트 또는 기본 메시지 렌더링
                detailText || "내용 없음 (클릭해서 작성)"
              )}
            </div>
          </div>

          {/* 팁 버튼: 클릭 시 팁 상세 내용 토글 */}
          <div
            className={st.tipButton}
            onClick={(e) => {
              e.stopPropagation(); // 클릭 이벤트 전파 방지
              setShowTipDetail((prev) => !prev); // 팁 상세 내용 토글
            }}
            style={{ cursor: "pointer" }}
          >
            <div className={st.tipButtonText}>
              {/* showTipDetail 상태에 따라 팁 내용 또는 "TIP!" 텍스트 렌더링 */}
              {showTipDetail ? tipText || "기본 TIP 내용" : "TIP!"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Question;
