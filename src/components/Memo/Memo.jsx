import { useEffect, useState } from "react";

import st from "./Memo.module.css";
import MemoLike from "./MemoLike";

import memo_line from "../../assets/memo_line.svg";
import memo_like from "../../assets/memo_like.svg";
import memo_edit from "../../assets/memo_edit.svg";
import memo_delete from "../../assets/memo_delete.svg";

import { fetchMemoDetail, toggleMemoLike } from "../../util/BoardDataAPI";

const Memo = ({ memo, teamId, memoId, onDelete, onEdit }) => {
  // state: 메모 내용 불러오기
  const [content, setContent] = useState(memo?.content || "");
  // 좋아요 상태 (내가 좋아요 눌렀는지)
  const [liked, setLiked] = useState(memo?.liked || false);
  // 좋아요 누른 사람 명함 리스트
  const [likeUsers, setLikeUsers] = useState(memo?.likeUsers || []);
  // state: 중복 호출 방지
  const [isFetched, setIsFetched] = useState(false);
  // state: 메모 작성자인지 판단
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    if (!teamId || !memoId || isFetched) return;

    // 메모 내용 불러오기
    const loadMemo = async () => {
      try {
        const memoData = await fetchMemoDetail(teamId, memoId);
        setContent(memoData.content);
        setLiked(memoData.liked || false);
        setLikeUsers(memoData.likeUsers || []);
        setIsMine(memoData.mine || false);
        setIsFetched(true);
      } catch (error) {
        if (error.response?.status !== 400) {
          console.error("메모 내용 불러오기 실패", error);
        }
        setContent("[불러오기 실패]");
      }
    };

    loadMemo();
  }, [teamId, memoId, isFetched]);

  useEffect(() => {
    if (memo?.content) setContent(memo.content);
  }, [memo?.content]);

  // 좋아요 버튼 클릭
  const handleLikeClick = async () => {
    try {
      const updatedMemo = await toggleMemoLike(teamId, memoId);
      setLiked(updatedMemo.liked);
      setLikeUsers(updatedMemo.likeUsers || []);
    } catch (error) {
      console.error("좋아요 처리 실패", error);
      alert("좋아요 처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={st.Memo}>
      <div className={st.Memo_tools}>
        {/* 좋아요 버튼 */}
        <div className={st.MemoLike_wrapper}>
          <img
            className={st.Memo_like_img}
            src={memo_like}
            alt="좋아요 버튼"
            style={{ cursor: "pointer", opacity: liked ? 1 : 0.5 }}
            onClick={handleLikeClick}
          />
          {likeUsers.length > 0 && (
            <div className={st.MemoLike_container}>
              <MemoLike users={likeUsers} />
            </div>
          )}
        </div>
        {isMine && (
          <div className={st.edit_delete}>
            <img
              className={st.Memo_edit_img}
              src={memo_edit}
              alt="memo_edit"
              onClick={() => onEdit({ memo, teamId, content })}
            />
            <img
              className={st.Memo_delete_img}
              src={memo_delete}
              alt="memo_delete"
              onClick={() => onDelete(teamId, memoId)}
            />
          </div>
        )}
      </div>
      <img className={st.Memo_line_img} src={memo_line} alt="memo_line" />
      {/* 메모 내용 */}
      <div className={st.Memo_text}>{content}</div>
    </div>
  );
};

export default Memo;
