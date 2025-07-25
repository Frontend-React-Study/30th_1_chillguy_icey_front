import { useEffect, useState } from "react";
import axios from "axios";

import st from "./Memo.module.css";
import MemoLike from "./MemoLike";

import memo_line from "../../assets/memo_line.svg";
import memo_like from "../../assets/memo_like.svg";
import memo_edit from "../../assets/memo_edit.svg";
import memo_delete from "../../assets/memo_delete.svg";

const Memo = ({ teamId, memoId, onDelete, onEdit }) => {
  // state: 메모 내용 불러오기
  const [content, setContent] = useState("");
  // 좋아요 상태 (내가 좋아요 눌렀는지)
  const [liked, setLiked] = useState(false);
  // 좋아요 누른 사람 명함 리스트
  const [likeUsers, setLikeUsers] = useState([]);

  useEffect(() => {
    const fetchMemoContent = async () => {
      try {
        const response = await axios.get(
          `/api/teams/${teamId}/memos/${memoId}`,
        );
        const memoData = response.data;
        setContent(memoData.content);

        // 좋아요 관련 초기값 세팅
        if (memoData.liked !== undefined) setLiked(memoData.liked);
        if (Array.isArray(memoData.likeUsers)) setLikeUsers(memoData.likeUsers);
      } catch (error) {
        console.error("메모 내용 불러오기 실패", error);
        setContent("[불러오기 실패]");
      }
    };

    fetchMemoContent();
  }, [teamId, memoId]);

  // 좋아요 버튼 클릭
  const handleLikeClick = async () => {
    try {
      const res = await axios.post(
        `/api/teams/${teamId}/memos/${memoId}/reactions`,
        {},
      );

      // 배열 중 첫 번째 메모 객체 사용 (해당 memoId와 일치하는 것으로 가정)
      const updatedMemo =
        res.data.find((memo) => memo.memoId === memoId) || res.data[0];

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
          <div className={st.MemoLike_container}>
            <MemoLike users={likeUsers} />
          </div>
        </div>
        <div className={st.edit_delete}>
          <img
            className={st.Memo_edit_img}
            src={memo_edit}
            alt="memo_edit"
            onClick={() => onEdit({ memoId, teamId, content })}
          />
          <img
            className={st.Memo_delete_img}
            src={memo_delete}
            alt="memo_delete"
            onClick={() => onDelete(teamId, memoId)}
          />
        </div>
      </div>
      <img className={st.Memo_line_img} src={memo_line} alt="memo_line" />
      <div className={st.Memo_text}>{content}</div>
    </div>
  );
};

export default Memo;
