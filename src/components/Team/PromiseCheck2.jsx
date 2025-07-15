import st from "./PromiseCheck.module.css";
import { useState } from "react";
import PromiseDate from "./promise/PromiseDate.jsx";
import PromiseTime2 from "./promise/PromiseTime2.jsx";
import Button from "../Button.jsx";
import { FaPen } from "react-icons/fa6";

const PromiseCheck2 = ({
  userType,
  allDates,
  othersVotes,
  mySelections,
  setMySelections,
  savedSelections,
  setSavedSelections,
}) => {
  const isLeader = userType === "Leader";
  const [view, setView] = useState(isLeader ? "date" : "time");

  const [isTimeEditing, setIsTimeEditing] = useState(false);
  const [isDateSaved, setIsDateSaved] = useState(false);
  const [mySelectionsLocal, setMySelectionsLocal] = useState(mySelections);

  const enableEdit = () => setIsTimeEditing(true);

  const saveTime = () => {
    setIsTimeEditing(false);
    setMySelections(mySelectionsLocal);
    setSavedSelections(mySelectionsLocal);
  };

  return (
    <div className={st.Promise_check_content}>
      <div className={st.button_space}>
        <div className={st.button_section}>
          {isLeader ? (
            <>
              <Button
                text="날짜"
                type={view === "date" ? "stroke" : ""}
                onClick={() => setView("date")}
              />
              <Button
                text="시간"
                type={view === "time" ? "stroke" : ""}
                onClick={() => setView("time")}
              />
            </>
          ) : (
            <Button text="시간" type="stroke" onClick={() => setView("time")} />
          )}
        </div>

        <div className={st.button_section}>
          {isLeader && <Button text="약속 확정" type="promise-no" />}
          <Button
            text="완료"
            disabled={view === "time" ? !isTimeEditing : isDateSaved}
            onClick={() => {
              if (view === "time") {
                saveTime();
              } else if (view === "date") {
                setIsDateSaved(true); // 더 이상 수정 불가
              }
            }}
          />
        </div>
      </div>

      <div className={st.promise_check_box}>
        {view === "date" && isLeader && (
          <PromiseDate isEditing={!isDateSaved} />
        )}
        {view === "time" && (
          <>
            <PromiseTime2
              allDates={allDates}
              othersVotes={othersVotes}
              mySelections={mySelectionsLocal}
              setMySelections={setMySelectionsLocal}
              savedSelections={savedSelections}
              setSavedSelections={setSavedSelections}
              isEditing={isTimeEditing}
            />
            <button
              className={`${st.edit_button} ${isTimeEditing ? st.edit_active : ""}`}
              onClick={enableEdit}
            >
              <FaPen className={st.edit_img} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PromiseCheck2;
