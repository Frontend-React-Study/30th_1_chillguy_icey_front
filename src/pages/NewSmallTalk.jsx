import { useState } from "react";
import st from "./NewSmallTalk.module.css";
import axios from "axios";
import Button from "../components/Button";
import ConfirmSnackbar from "../components/NewSmallTalk/ConfirmSnackbar";

const NewSmallTalk = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleTeamPageClick = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const [targetText, setTargetText] = useState("");
  const [purposeText, setPurposeText] = useState("");

  const handleTargetChange = (e) => {
    const input = e.target.value;
    if (input.length <= 12) setTargetText(input);
  };

  const handlePurposeChange = (e) => {
    const input = e.target.value;
    if (input.length <= 12) setPurposeText(input);
  };

  const postsmalltalk = async () => {
    try {
      const res = await axios.post(
        "https://icey-backend-1027532113913.asia-northeast3.run.app/api/smalltalk/preview",
        {
          target: targetText,
          purpose: purposeText,
        },
      );
      console.log("스몰톡 생성", res.data);
      return res.data.data;
    } catch (error) {
      console.error("실패:", error);
    }
  };

  return (
    <div className={st.body}>
      <div className={st.title}>
        <div className={st.title1}>스몰톡 주제 선택</div>
        <div className={st.title2}>
          스몰톡 대상, 모임 목적 등을 작성해주세요.
        </div>
      </div>
      <div className={st.target_purpose}>
        <div className={st.input_box}>
          <div className={st.target_purpose_text}>대상</div>
          <div className={st.ex_div}>
            <div className={st.ex}>ex.</div>
            <div className={st.ex_text}>
              개발동아리에서 처음 만난 팀원
              <br />
              오랜만에 만난 중학교 동창
              <br />
              어려운 직장 상사
            </div>
          </div>
          <div className={st.input}>
            <input
              className={st.input_tp}
              type="text"
              placeholder="직접 작성"
              value={targetText}
              onChange={handleTargetChange}
            />

            <div className={st.line}></div>
          </div>
        </div>

        <div className={st.input_box}>
          <div className={st.target_purpose_text}>목적</div>
          <div className={st.ex_div}>
            <div className={st.ex}>ex.</div>
            <div className={st.ex_text}>
              첫 회의에서의 아이스브레이킹
              <br />
              자연스러운 공감대 형성
              <br />
              업무에 대한 조언 요청
            </div>
          </div>
          <div className={st.input}>
            <input
              className={st.input_tp}
              type="text"
              placeholder="직접 작성"
              value={purposeText}
              onChange={handlePurposeChange}
            />

            <div className={st.line}></div>
          </div>
        </div>
      </div>
      <Button text={"생성하기"} type={"long"} onClick={handleTeamPageClick} />
      {showPopup && (
        <ConfirmSnackbar onClick={postsmalltalk} onClose={closePopup} />
      )}
    </div>
  );
};

export default NewSmallTalk;
