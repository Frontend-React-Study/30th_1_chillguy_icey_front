import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import st from "./SmallTalk.module.css";

import MakeSmallTalk from "../components/SmallTalk/MakeSmallTalk";
import Minilist from "../components/SmallTalk/SmallTalk_minilist"; // 사용자 요청에 따라 Minilist 임포트 경로 복원
import SmallTalkName from "../components/SmallTalk/SmallTalkName";
import { useAuth } from "../context/AuthContext";
import {
  getSmallTalkList,
  getSmallTalkDetail,
  deleteSmallTalkList, // deleteSmallTalk 대신 deleteSmallTalkList로 변경 유지
} from "../util/SmallTalkAPI";

const SmallTalk = () => {
  const { token } = useAuth();
  const location = useLocation();
  const [list, setList] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();

  const [selectedSmallTalkDetail, setSelectedSmallTalkDetail] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const QUESTIONS_PER_PREVIEW = 5;

  const fetchSmallTalkList = useCallback(async () => {
    try {
      const res = await getSmallTalkList(token);
      const smallTalkList = res.data?.data;

      // 1. API 응답 원본 데이터 로그 (중복 여부 확인)
      console.log(
        "fetchSmallTalkList: API 응답 smallTalkList 원본:",
        smallTalkList,
      );

      if (Array.isArray(smallTalkList)) {
        const formattedList = smallTalkList.map((item) => ({
          id: item.id,
          title: item.title,
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString("ko-KR")
            : "",
        }));

        // 2. setList 직전, 포맷팅된 목록 로그 (중복 여부 확인)
        console.log(
          "fetchSmallTalkList: setList 직전 formattedList:",
          formattedList,
        );
        setList(formattedList);

        if (formattedList.length > 0) {
          const newSmallTalkId = location.state?.newSmallTalkId;
          let targetId = null;

          if (
            newSmallTalkId &&
            formattedList.some((item) => item.id === newSmallTalkId)
          ) {
            targetId = newSmallTalkId;
          } else if (
            selectedId &&
            formattedList.some((item) => item.id === selectedId)
          ) {
            targetId = selectedId;
          } else {
            targetId = formattedList[0].id;
          }
          setSelectedId(targetId);
        } else {
          setSelectedId(null);
          setSelectedSmallTalkDetail(null);
        }
      } else {
        console.warn(
          "smallTalkList는 배열이 아닙니다. 받은 값:",
          smallTalkList,
        );
        setList([]);
        setSelectedId(null);
        setSelectedSmallTalkDetail(null);
      }
    } catch (error) {
      console.error("스몰톡 리스트 불러오기 실패:", error);
      setList([]);
      setSelectedId(null);
      setSelectedSmallTalkDetail(null);
    }
  }, [
    token,
    location.state,
    selectedId,
    setList,
    setSelectedId,
    setSelectedSmallTalkDetail,
  ]);

  const fetchSmallTalkDetail = useCallback(
    async (id) => {
      if (!id) {
        setSelectedSmallTalkDetail(null);
        return;
      }
      setIsLoadingDetail(true);
      try {
        const res = await getSmallTalkDetail(id, token);
        console.log(
          "SmallTalk.jsx - 상세 스몰톡 API 응답 데이터:",
          res.data.data,
        );
        setSelectedSmallTalkDetail(res.data.data);
      } catch (error) {
        console.error("스몰톡 상세 불러오기 실패:", error);
        setSelectedSmallTalkDetail(null);
      } finally {
        setIsLoadingDetail(false);
      }
    },
    [token, setSelectedSmallTalkDetail, setIsLoadingDetail],
  );

  const handleDelete = async (listId) => {
    console.log("삭제 시도 ID:", listId);
    try {
      await deleteSmallTalkList(listId, token);
      console.log(`스몰톡 ID ${listId} 삭제 성공`);
      alert("스몰톡이 성공적으로 삭제되었습니다.");
      fetchSmallTalkList();
    } catch (error) {
      console.error(`스몰톡 ID ${listId} 삭제 실패:`, error);
      console.error("삭제 API 오류 응답:", error.response || error);
      alert(
        `스몰톡 삭제 실패: ${error.message || error.response?.data?.message || "알 수 없는 오류"}`,
      );
    }
  };

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const onClickNewSmall = () => {
    navigate("/newsmalltalk");
  };

  const onClickViewAll = () => {
    console.log("onClickViewAll 호출됨");
    console.log("selectedSmallTalkDetail 상태:", selectedSmallTalkDetail);

    if (selectedSmallTalkDetail) {
      navigate("/editsmall", {
        state: { smallTalk: selectedSmallTalkDetail },
      });
    } else {
      alert("스몰톡을 먼저 선택해주세요.");
      console.warn("스몰톡 상세 정보가 없습니다.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchSmallTalkList();
    }
  }, [
    token,
    location.state?.refresh,
    location.state?.newSmallTalkId,
    fetchSmallTalkList,
  ]);

  useEffect(() => {
    if (selectedId && token) {
      fetchSmallTalkDetail(selectedId);
    } else if (selectedId === null) {
      setSelectedSmallTalkDetail(null);
      setIsLoadingDetail(false);
    }
  }, [selectedId, token, fetchSmallTalkDetail]);

  useEffect(() => {
    if (location.state?.refresh || location.state?.newSmallTalkId) {
      const newState = { ...location.state };
      delete newState.refresh;
      delete newState.newSmallTalkId;

      navigate(location.pathname, {
        replace: true,
        state: newState,
      });
    }
  }, [location.state, navigate, location.pathname]);

  const previewQuestions = selectedSmallTalkDetail
    ? [
        ...selectedSmallTalkDetail.smallTalks
          .filter((q) => q.questionType === "AI" || q.answer || q.tip)
          .slice(0, QUESTIONS_PER_PREVIEW),
        ...selectedSmallTalkDetail.smallTalks.filter(
          (q) => q.questionType === "USER" || (!q.answer && !q.tip),
        ),
      ]
    : [];

  // 3. 컴포넌트 렌더링 시 현재 list 상태 로그 (최종 화면에 표시되는 목록 확인)
  useEffect(() => {
    console.log("SmallTalk 컴포넌트 렌더링: 현재 list 상태:", list);
  }, [list]); // list 상태가 변경될 때마다 로그 출력

  return (
    <div className={st.body}>
      <div className={st.list_section}>
        <div className={st.list_title}>
          <div className={st.list_div}>
            <div className={st.list}>스몰톡 리스트</div>
          </div>

          {list.map((item) => (
            <SmallTalkName
              key={item.id}
              date={item.date}
              text={item.title}
              onSelect={() => handleSelect(item.id)}
              onDelete={() => handleDelete(item.id)}
              isSelected={item.id === selectedId}
            />
          ))}
        </div>
      </div>
      <div className={st.left_section}>
        <div className={st.upperSection}>
          <div className={st.target_purpose}>
            {/* selectedId가 있고, selectedSmallTalkDetail이 유효할 때만 내용을 렌더링 */}
            {selectedId && selectedSmallTalkDetail ? (
              <>
                <div className={st.d}>
                  <div className={st.ds}>대상 :</div>
                  {/* '동기' 대신 실제 target 값 표시 */}
                  <div className={st.dg}>{selectedSmallTalkDetail.target}</div>
                </div>
                <div className={st.mj}>
                  <div className={st.ds}>목적 :</div>
                  <div className={st.o}>{selectedSmallTalkDetail.purpose}</div>
                </div>
              </>
            ) : // selectedId가 없거나, 상세 정보가 아직 로드되지 않았을 때의 대체 UI
            // 이 블록은 selectedId가 true이지만 selectedSmallTalkDetail이 아직 null일 때를 위해 비워둡니다.
            // (selectedId가 아예 없는 경우는 아래 !selectedId && ... 블록에서 처리)
            null}
          </div>

          <MakeSmallTalk onClick={onClickNewSmall} />
        </div>
        {/* selectedId가 없을 때 표시되는 메시지 (사용자 코드 위치 유지) */}
        {!selectedId && (
          <div className={st.notselected}>
            <div className={st.select}>스몰톡 리스트를 선택해주세요</div>
            <div className={st.make}>
              리스트 항목이 없다면
              <br />
              스몰톡을 생성하세요!
            </div>
          </div>
        )}

        {/* Minilist는 selectedId와 selectedSmallTalkDetail이 모두 유효할 때만 렌더링 */}
        {selectedId && selectedSmallTalkDetail && (
          <Minilist
            smallTalks={previewQuestions} // 필터링된 질문 목록 전달
            onViewAllClick={onClickViewAll} // onClickViewAll 함수를 prop으로 전달
          />
        )}
      </div>
    </div>
  );
};

export default SmallTalk;
