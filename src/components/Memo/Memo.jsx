import st from "./Memo.module.css";
import memo_line from "../../assets/memo_line.svg";
import memo_like from "../../assets/memo_like.svg";
import memo_edit from "../../assets/memo_edit.svg";
import memo_delete from "../../assets/memo_delete.svg";

const Memo = () => {
  return (
    <div className={st.Memo}>
      <div className={st.Memo_tools}>
        <img className={st.Memo_like_img} src={memo_like} alt="memo_like" />
        <div className={st.edit_delete}>
          <img className={st.Memo_edit_img} src={memo_edit} alt="memo_edit" />
          <img
            className={st.Memo_delete_img}
            src={memo_delete}
            alt="memo_delete"
          />
        </div>
      </div>
      <img className={st.Memo_line_img} src={memo_line} alt="memo_line" />
      <div className={st.Memo_text}>
        팀페이지에서 팀원에게 쪽지를 보내보세요
      </div>
    </div>
  );
};

export default Memo;
