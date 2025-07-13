import { useState } from "react";
import st from "./MemoEdit.module.css";
import memo_save from "../../assets/memo_save.svg";

const MemoEdit = () => {
  const [text, setText] = useState("");
  const handleChange = (e) => {
    const input = e.target.value;

    // 글자 수 제한
    if (input.length > 130) return;

    // 줄 수 제한 (10줄 이상이면 return)
    const lines = input.split("\n");
    if (lines.length > 10) return;

    setText(input);
  };
  return (
    <div className={st.MemoEdit}>
      <textarea
        className={st.Memo_area}
        placeholder="내용을 작성해 주세요.."
        value={text}
        onChange={(e) => {
          const input = e.target.value;
          if (input.length > 130) return;

          const lines = input.split("\n");
          if (lines.length > 10) return;
          setText(e.target.value);
        }}
      ></textarea>
      <div className={st.Memo_tools}>
        <div className={st.Counter}>{text.length} / 130</div>
        <img className={st.Memo_save_img} src={memo_save} alt="memo_save" />
      </div>
    </div>
  );
};

export default MemoEdit;
