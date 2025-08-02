import { useState, useEffect } from "react";
import st from "./EditSmall.module.css";
import {
  deleteSmallTalkTalkItem,
  saveSmallTalk, // POST /api/smalltalk/save API를 호출하는 함수
  updateSmallTalkTitle, // 스몰톡 제목 업데이트 API 임포트
  editSmallTalkQuestions, // 스몰톡 질문 내용 편집 API 임포트
} from "../util/SmallTalkAPI"; // API 함수 임포트
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Snow from "../assets/Snow.svg";
import save from "../assets/save.svg";
import edit from "../assets/edit.svg";
import Question from "../components/EditSmall/Question";
import CustomInput from "../components/EditSmall/CustomInput"; // CustomInput 임포트
import CustomInput_write from "../components/EditSmall/CustomInput_write";
import Question_pop_up from "../components/EditSmall/Question_pop_up";
import { useLocation, useNavigate } from "react-router-dom";

function EditSmall() {
  const location = useLocation();
  const navigate = useNavigate();
  const smallTalk = location.state?.smallTalk; // SmallTalk.jsx에서 전달받은 스몰톡 데이터

  const { token } = useAuth();

  // 디버깅을 위한 로그 (smallTalk 객체와 createdAt 값 확인)
  useEffect(() => {
    console.log("EditSmall 컴포넌트 로드됨:");
    console.log("   smallTalk 객체 (location.state):", smallTalk);
    console.log("   smallTalk.createdAt 값:", smallTalk?.createdAt); // 생성 날짜가 null인지 확인
    console.log("   인증 토큰:", token);
  }, [smallTalk, token]);

  // 모든 API 질문의 마스터 목록
  const [allApiQuestions, setAllApiQuestions] = useState([]);
  // 현재 화면에 표시되는 API 질문 목록 (최대 QUESTIONS_PER_PAGE 개)
  const [currentDisplayedApiQuestions, setCurrentDisplayedApiQuestions] =
    useState([]);
  // 사용자가 직접 입력한 질문 목록
  const [userQuestions, setUserQuestions] = useState([]);

  // '바꾸기' 기능에 사용될, 아직 화면에 표시되지 않은 API 질문들의 풀(pool)
  const [availableReplacementPool, setAvailableReplacementPool] = useState([]);

  // 스몰톡의 제목 상태
  const [title, setTitle] = useState("");
  // 제목 수정 모드 여부
  const [isEditing, setIsEditing] = useState(false);

  // 사용자가 직접 질문을 작성 중인지 여부
  const [isWriting, setIsWriting] = useState(false);

  // 팝업 관련 상태
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [questionIdToConfirmReplace, setQuestionIdToConfirmReplace] =
    useState(null);

  // 교체 횟수 관리
  const [replaceCount, setReplaceCount] = useState(0);
  const MAX_REPLACE_COUNT = 3;

  const QUESTIONS_PER_PAGE = 5;

  // 스몰톡 로드 시 초기 질문 상태를 저장하여 변경 사항을 추적할 수 있도록 함
  const [originalQuestionsState, setOriginalQuestionsState] = useState([]);

  // smallTalk 데이터가 변경될 때마다 제목과 질문들을 초기화합니다.
  useEffect(() => {
    if (smallTalk) {
      if (smallTalk.title) {
        setTitle(smallTalk.title);
      } else {
        setTitle("");
      }

      if (Array.isArray(smallTalk.smallTalks)) {
        // 모든 질문에 클라이언트 측에서 사용할 고유 ID를 부여하고 questionType을 명확히 함
        const initialCombinedQuestions = smallTalk.smallTalks.map((q) => ({
          ...q,
          id:
            q.id === null || q.id === undefined || q.id === ""
              ? crypto.randomUUID() // 임시 클라이언트 ID
              : q.id,
          questionType: q.questionType || (q.answer || q.tip ? "AI" : "USER"),
        }));

        // 초기 상태 저장 (diffing을 위해)
        setOriginalQuestionsState(initialCombinedQuestions);

        // questionType이 'AI'이거나 answer 또는 tip 필드가 있는 경우를 API 질문으로 간주
        const fetchedApiQuestions = initialCombinedQuestions.filter(
          (q) => q.questionType === "AI",
        );

        // questionType이 'USER'이거나 answer와 tip 필드가 모두 없는 경우를 사용자 질문으로 간주
        const fetchedUserQuestions = initialCombinedQuestions.filter(
          (q) => q.questionType === "USER",
        );

        setAllApiQuestions(fetchedApiQuestions); // 모든 API 질문 (마스터 목록) 저장
        setUserQuestions(fetchedUserQuestions); // 사용자 질문 저장

        // 초기 화면에 표시될 질문들 (API 질문 중 처음 5개)
        setCurrentDisplayedApiQuestions(
          fetchedApiQuestions.slice(0, QUESTIONS_PER_PAGE),
        );
        // 교체에 사용될 나머지 질문들
        const initialReplacementPool =
          fetchedApiQuestions.slice(QUESTIONS_PER_PAGE);
        setAvailableReplacementPool(initialReplacementPool);
        setReplaceCount(0); // 새로운 스몰톡 로드 시 교체 횟수 초기화

        // 초기 질문 풀 크기 로그 추가
        console.log(
          "초기화: fetchedApiQuestions.length:",
          fetchedApiQuestions.length,
        );
        console.log(
          "초기화: availableReplacementPool.length (slice 후):",
          initialReplacementPool.length,
        );
        console.log(
          "초기화: availableReplacementPool 내용:",
          initialReplacementPool,
        );
      } else {
        setAllApiQuestions([]);
        setUserQuestions([]);
        setCurrentDisplayedApiQuestions([]);
        setAvailableReplacementPool([]);
        setReplaceCount(0);
        setOriginalQuestionsState([]); // 초기 상태도 초기화
      }
    }
  }, [smallTalk]);

  // ISO 문자열을 'YYYY.MM.DD' 형태로 변환하는 유틸리티 함수
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      console.error("formatDate: 유효하지 않은 날짜 문자열:", isoString);
      return "";
    }
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd}`;
  };

  // 제목만 저장하는 핸들러 (제목 옆 저장 아이콘 클릭 시)
  const handleSaveTitleOnly = async () => {
    if (title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    // 제목 길이 제한 추가
    if (title.length > 5) {
      alert("제목은 5글자 이하로 입력해주세요.");
      return;
    }
    if (!token) {
      console.error("토큰이 없습니다. 제목을 저장할 수 없습니다.");
      return;
    }
    if (!smallTalk?.id) {
      alert("스몰톡 ID가 없어 제목을 업데이트할 수 없습니다.");
      console.error("스몰톡 ID가 없어 제목 업데이트 불가");
      return;
    }

    // 제목이 변경되었을 때만 API 호출
    if (title !== smallTalk.title) {
      try {
        console.log(
          `제목 업데이트 API 호출: ID ${smallTalk.id}, 새 제목: ${title}`,
        );
        await updateSmallTalkTitle(smallTalk.id, title, token);
        console.log("제목 업데이트 성공!");
        alert("제목이 성공적으로 업데이트되었습니다.");
      } catch (error) {
        console.error("제목 업데이트 중 오류 발생:", error);
        console.error("제목 업데이트 API 오류 응답:", error.response || error);
        alert("제목 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      console.log("제목 변경 사항이 없어 업데이트를 건너킵니다.");
    }
    setIsEditing(false); // 저장 후 읽기 모드로 전환
  };

  // 모든 변경 사항을 저장하는 핸들러 (하단 '저장하기' 버튼 클릭 시)
  const handleSaveAllChanges = async () => {
    if (title.trim() === "") {
      console.warn("제목을 입력해주세요.");
      return;
    }
    // 제목 길이 제한 추가
    if (title.length > 5) {
      alert("제목은 5글자 이하로 입력해주세요.");
      return;
    }

    if (!token) {
      console.error("토큰이 없습니다. 저장할 수 없습니다.");
      return;
    }

    // 새로운 스몰톡인지 기존 스몰톡인지 구분
    if (!smallTalk?.id || smallTalk.id === 0) {
      // 새로운 스몰톡 생성 (POST /api/smalltalk/save)
      const finalSmallTalksForPayload = [];
      // 현재 화면에 표시되는 AI 질문과 사용자 질문을 모두 포함
      const allCurrentQuestionsForNewSave = [
        ...currentDisplayedApiQuestions,
        ...userQuestions,
      ];

      allCurrentQuestionsForNewSave.forEach((q) => {
        finalSmallTalksForPayload.push({
          id: 0, // 새로운 질문이므로 ID는 0
          question: q.question,
          tip: q.tip || "",
          answer: q.answer || "",
          questionType: q.questionType, // 이미 결정된 questionType 사용
        });
      });

      // 백엔드 API 스키마에 따라 smallTalks 배열이 비어있으면 400 Bad Request가 발생할 수 있습니다.
      if (finalSmallTalksForPayload.length === 0) {
        console.warn(
          "스몰톡 질문이 비어있습니다. 백엔드 요구사항을 위해 기본 질문을 추가합니다.",
        );
        finalSmallTalksForPayload.push({
          id: 0,
          question: "새로운 스몰톡을 시작합니다.",
          tip: "",
          answer: "",
          questionType: "AI",
        });
      }

      const payload = {
        id: 0, // 새로운 스몰톡이므로 ID는 0
        target: smallTalk?.target || "",
        purpose: smallTalk?.purpose || "",
        title: title,
        smallTalks: finalSmallTalksForPayload,
      };

      console.log(
        "handleSaveAllChanges: 새로운 스몰톡 저장 페이로드:",
        payload,
      );

      try {
        const res = await saveSmallTalk(payload, token);
        console.log("새 스몰톡 저장 성공:", res.data);
        alert("새 스몰톡이 성공적으로 저장되었습니다!");

        navigate("/smalltalk", {
          state: { refresh: true, newSmallTalkId: res.data.data.id },
        });
      } catch (error) {
        console.error("새 스몰톡 저장 중 오류 발생:", error);
        console.error("새 스몰톡 저장 API 오류 응답:", error.response || error);
        alert("새 스몰톡 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    } else {
      // 기존 스몰톡 수정 (PUT /api/smalltalk/list/{listId}/edit)
      const listId = smallTalk.id;
      const edits = [];

      // 백엔드에 보낼 모든 질문 (allApiQuestions와 userQuestions를 합침)
      // allApiQuestions는 현재 화면에 표시된 5개와 availableReplacementPool에 남아있는 질문을 모두 포함합니다.
      const questionsToPersist = [...allApiQuestions, ...userQuestions];

      // 현재 유지되어야 할 질문들의 ID를 빠르게 찾기 위한 Set
      const questionsToPersistIds = new Set(
        questionsToPersist.map((q) => q.id),
      );

      // 1. 현재 클라이언트가 가지고 있는 모든 질문을 'edits' 배열에 추가 (추가 또는 수정된 것으로 간주)
      questionsToPersist.forEach((currentQ) => {
        let processedIdForEdit = 0;
        if (typeof currentQ.id === "number" && currentQ.id !== 0) {
          processedIdForEdit = currentQ.id; // 기존 백엔드 ID 유지
        } else if (
          typeof currentQ.id === "string" &&
          currentQ.id.startsWith("new_")
        ) {
          processedIdForEdit = 0; // 클라이언트 측에서 생성된 새 임시 ID -> 0으로 변환
        } else {
          // 백엔드에서 온 문자열 ID 중 숫자로 변환 가능한 경우
          const numId = Number(currentQ.id);
          if (!isNaN(numId) && currentQ.id !== "") {
            processedIdForEdit = numId;
          } else {
            processedIdForEdit = 0; // 유효하지 않은 문자열 ID는 새로 추가된 것으로 간주
          }
        }

        edits.push({
          id: processedIdForEdit,
          question: currentQ.question,
          tip: currentQ.tip || "",
          answer: currentQ.answer || "",
          questionType: currentQ.questionType,
        });
      });

      // 2. originalQuestionsState에는 있었지만 questionsToPersist에는 없는 질문 식별 (삭제된 질문)
      originalQuestionsState.forEach((originalQ) => {
        // 백엔드 ID를 가진 질문만 삭제 대상으로 고려
        if (typeof originalQ.id === "number" && originalQ.id !== 0) {
          if (!questionsToPersistIds.has(originalQ.id)) {
            edits.push({ id: originalQ.id, deleted: true });
          }
        }
      });

      console.log(
        "handleSaveAllChanges: 기존 스몰톡 질문 업데이트 페이로드 (edits):",
        edits,
      );

      if (edits.length > 0) {
        try {
          // API 스키마에 맞게 edits 배열을 { edits: [...] } 객체로 감싸서 전달
          const res = await editSmallTalkQuestions(listId, { edits }, token);
          console.log("기존 스몰톡 질문 업데이트 성공:", res.data);
          alert("스몰톡 질문이 성공적으로 업데이트되었습니다!");

          navigate("/smalltalk", {
            state: { refresh: true, newSmallTalkId: listId }, // 업데이트된 스몰톡 ID 전달
          });
        } catch (error) {
          console.error("기존 스몰톡 질문 업데이트 중 오류 발생:", error);
          console.error(
            "기존 스몰톡 질문 업데이트 API 오류 응답:",
            error.response || error,
          );
          alert(
            "스몰톡 질문 업데이트 중 오류가 발생했습니다. 다시 시도해주세요.",
          );
        }
      } else {
        console.log("질문 변경 사항이 없어 질문 업데이트를 건너킵니다.");
        alert("변경 사항이 없습니다."); // 질문 변경이 없을 경우 알림
        navigate("/smalltalk", {
          state: { refresh: true, newSmallTalkId: listId },
        });
      }
    }
  };

  // 제목 편집 모드 활성화 핸들러
  const onEdit = () => setIsEditing(true);

  // '질문 직접 입력하기' 버튼 클릭 핸들러
  const handleStartWriting = () => setIsWriting(true);

  // CustomInput_write에서 새로운 질문이 저장될 때 호출되는 핸들러
  const handleSaveQuestion = (newQuestionText) => {
    if (newQuestionText.trim() === "") {
      console.warn("빈 질문은 저장할 수 없습니다.");
      return;
    }
    // 새로운 사용자 질문을 userQuestions 상태에 추가합니다.
    // 각 질문에 고유한 ID를 부여합니다 (API 전송 시 0으로 변환될 "new_" 접두사 사용).
    setUserQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        question: newQuestionText,
        id: `new_${crypto.randomUUID()}`,
        answer: "",
        questionType: "USER",
      }, // 임시 ID 및 answer, questionType 필드 추가
    ]);
    setIsWriting(false); // 저장 후 CustomInput_write 숨기기
  };

  // Question 컴포넌트의 '바꾸기' 버튼 클릭 시 팝업을 띄우는 핸들러
  const handleOpenReplaceConfirm = (questionId) => {
    // 로그 추가: 바꾸기 버튼 클릭 시점
    console.log(
      `바꾸기 버튼 클릭 시점: replaceCount = ${replaceCount}, availableReplacementPool.length = ${availableReplacementPool.length}`,
    );

    if (
      replaceCount >= MAX_REPLACE_COUNT ||
      availableReplacementPool.length === 0
    ) {
      console.log("더 이상 교체할 수 없거나 교체 횟수를 초과했습니다.");
      return;
    }
    setQuestionIdToConfirmReplace(questionId);
    setShowConfirmPopup(true);
  };

  // 팝업에서 '바꾸기'를 최종 확인했을 때 실행되는 핸들러
  const handleConfirmReplace = () => {
    // 로그 추가: 팝업 확인 시점
    console.log(
      `팝업 확인 시점: replaceCount = ${replaceCount}, availableReplacementPool.length = ${availableReplacementPool.length}`,
    );

    if (
      replaceCount >= MAX_REPLACE_COUNT ||
      availableReplacementPool.length === 0
    ) {
      console.log("더 이상 교체할 수 없거나 교체 횟수를 초과했습니다.");
      setShowConfirmPopup(false);
      return;
    }

    // availableReplacementPool에서 첫 번째 질문을 가져옵니다.
    const newQuestion = availableReplacementPool[0];

    // 현재 표시 중인 질문 목록에서 클릭된 질문을 새로운 질문으로 교체합니다.
    setCurrentDisplayedApiQuestions((prevDisplayed) => {
      const updatedDisplayed = prevDisplayed.map((q) =>
        q.id === questionIdToConfirmReplace ? newQuestion : q,
      );
      // allApiQuestions 마스터 목록도 업데이트 (교체된 질문은 제거하고 새 질문 추가)
      // 이 로직은 실제 API를 통해 질문을 교체하는 것이 아니라, 클라이언트 상태에서 교체하는 것이므로
      // 서버에 변경사항을 반영하려면 onSave 시 allApiQuestions를 보내야 합니다.
      setAllApiQuestions((prevAll) => {
        const tempAll = prevAll.filter(
          (q) => q.id !== questionIdToConfirmReplace,
        );
        return [...tempAll, newQuestion];
      });
      return updatedDisplayed;
    });

    // 사용된 질문은 availableReplacementPool에서 제거합니다.
    setAvailableReplacementPool((prevPool) => prevPool.slice(1));
    setReplaceCount((prevCount) => prevCount + 1); // 교체 횟수 증가

    setShowConfirmPopup(false); // 팝업 닫기
    setQuestionIdToConfirmReplace(null); // ID 초기화
  };

  // 팝업에서 '취소' 버튼 클릭 시 실행되는 핸들러
  const handleCancelReplace = () => {
    setShowConfirmPopup(false);
    setQuestionIdToConfirmReplace(null);
  };

  // Question 컴포넌트에서 상세 내용(answer)이 변경될 때 호출될 핸들러
  const handleDetailTextChange = (questionId, newDetailText) => {
    setCurrentDisplayedApiQuestions((prevDisplayed) =>
      prevDisplayed.map((q) =>
        q.id === questionId ? { ...q, answer: newDetailText } : q,
      ),
    );
    setAllApiQuestions((prevAll) =>
      prevAll.map((q) =>
        q.id === questionId ? { ...q, answer: newDetailText } : q,
      ),
    );
  };

  // '바꾸기' 버튼 비활성화 여부 결정
  const disableReplaceButton =
    availableReplacementPool.length === 0 || replaceCount >= MAX_REPLACE_COUNT;

  return (
    <div className={st.editSmallPageContainer}>
      <div className={st.headerSection}>
        <div className={st.headerContent}>
          <img className={st.snowIcon} src={Snow} alt="snow" />
          <div className={st.dateText}>{formatDate(smallTalk?.createdAt)}</div>
          <div className={st.titleEditContainer}>
            <div className={st.titleInputWrapper}>
              {isEditing ? (
                <>
                  <input
                    className={st.titleInput}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목 입력.."
                    spellCheck={false}
                    maxLength={6} // 제목 길이 제한 추가
                  />
                  <div className={st.titleUnderline}></div>
                </>
              ) : (
                <div className={st.smallTalkTitle}>{title}</div>
              )}
            </div>
            <img
              className={st.editSaveIcon}
              src={isEditing ? save : edit}
              alt={isEditing ? "save" : "edit"}
              onClick={isEditing ? handleSaveTitleOnly : onEdit} // 제목 저장 아이콘 클릭 핸들러 변경
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className={st.targetText}>{smallTalk?.target}</div>
          <div className={st.purposeText}>{smallTalk?.purpose}</div>
        </div>
        <div className={st.headerDivider}></div>
      </div>

      <div className={st.questionsListContainer}>
        {currentDisplayedApiQuestions.map((q) => (
          <Question
            key={q.id}
            id={q.id}
            text={q.question}
            initialDetailText={q.answer || ""}
            tipText={q.tip}
            onDetailTextChange={handleDetailTextChange}
            onDelete={async (deletedId) => {
              if (!token) {
                console.error("토큰이 없습니다. 삭제할 수 없습니다.");
                return;
              }
              try {
                // 백엔드 API 호출로 질문 삭제
                await deleteSmallTalkTalkItem(deletedId, token);
                console.log(`질문 ID: ${deletedId} 삭제 성공`);

                // allApiQuestions, currentDisplayedApiQuestions, availableReplacementPool에서 해당 질문 제거
                setAllApiQuestions((prevAll) =>
                  prevAll.filter((item) => item.id !== deletedId),
                );
                setCurrentDisplayedApiQuestions((prevDisplayed) =>
                  prevDisplayed.filter((item) => item.id !== deletedId),
                );
                setAvailableReplacementPool((prevPool) =>
                  prevPool.filter((item) => item.id !== deletedId),
                );

                alert("질문이 삭제되었습니다.");
              } catch (error) {
                console.error("질문 삭제 중 오류 발생:", error);
                alert("질문 삭제 중 오류가 발생했습니다. 다시 시도해주세요.");
              }
            }}
            onReplaceClick={handleOpenReplaceConfirm}
            disableReplaceButton={disableReplaceButton}
          />
        ))}

        {userQuestions.map((q) => (
          <CustomInput
            key={q.id}
            id={q.id}
            text={q.question}
            onDelete={async (deletedId) => {
              if (!token) {
                console.error("토큰이 없습니다. 삭제할 수 없습니다.");
                return;
              }

              // 클라이언트 측 임시 ID (예: 'new_'로 시작)인 경우 API 호출 없이 로컬에서만 삭제
              if (
                typeof deletedId === "string" &&
                deletedId.startsWith("new_")
              ) {
                console.log(
                  `클라이언트 측 임시 ID ${deletedId}를 가진 사용자 질문 로컬 삭제`,
                );
                setUserQuestions((prev) =>
                  prev.filter((item) => item.id !== deletedId),
                );
                alert("사용자 질문이 성공적으로 삭제되었습니다.");
              } else {
                // 백엔드에서 온 ID인 경우 API 호출을 통해 삭제
                try {
                  await deleteSmallTalkTalkItem(deletedId, token);
                  console.log(
                    `사용자 질문 ID: ${deletedId} 삭제 성공 (API 호출)`,
                  );
                  setUserQuestions((prev) =>
                    prev.filter((item) => item.id !== deletedId),
                  );
                  alert("사용자 질문이 성공적으로 삭제되었습니다.");
                } catch (error) {
                  console.error("사용자 질문 삭제 중 오류 발생:", error);
                  alert(
                    "사용자 질문 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
                  );
                }
              }
            }}
          />
        ))}

        {isWriting && (
          <CustomInput_write
            onSave={handleSaveQuestion}
            onCancel={() => setIsWriting(false)}
          />
        )}
        <div
          className={st.addQuestionButtonWrapper}
          onClick={handleStartWriting}
          style={{ cursor: "pointer" }}
        >
          <div className={st.addQuestionButtonText}>질문 직접 입력하기</div>
        </div>
      </div>

      <Button
        text={"저장하기"}
        type={!token ? "longdisabled" : "long"}
        onClick={handleSaveAllChanges}
        disabled={!token}
      />
      {showConfirmPopup && (
        <Question_pop_up
          currentCount={replaceCount}
          maxCount={MAX_REPLACE_COUNT}
          onConfirm={handleConfirmReplace}
          onCancel={handleCancelReplace}
          disableConfirmButton={
            replaceCount >= MAX_REPLACE_COUNT ||
            availableReplacementPool.length === 0
          }
        />
      )}
    </div>
  );
}

export default EditSmall;
