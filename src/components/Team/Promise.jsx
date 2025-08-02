import st from "./Promise.module.css";
import PromiseCalendar from "./promise/PromiseCalendar.jsx";
import EXPromiseCalendar from "./promise/EXPromiseCalendar.jsx";

const Promise = ({ team, teamCreateDate, goalDate }) => {
  const goals = goalDate ? goalDate.split("-") : [];

  let dday = null;
  if (goalDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거

    const goal = new Date(goalDate);
    goal.setHours(0, 0, 0, 0); // 시간 제거

    const diffTime = goal.getTime() - today.getTime();
    dday = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dday === 0) {
      dday = "DAY";
    }
  }
  const goalsHour = team.confirmedHour ? team.confirmedHour : 0;
  let completionHour = "";
  let hour = "";
  if (goalsHour) {
    const offset = goalsHour > 12 ? (goalsHour === 24 ? "AM" : "PM") : "AM";
    const h = goalsHour > 12 ? goalsHour - 12 : goalsHour;
    const h0 = h < 10 ? `${offset} 0${h}:00` : `${offset} ${h}:00`;

    completionHour = h0;
  }

  return (
    <div className={st.Promise_content}>
      <div className={st.promise_calendar_box}>
        <EXPromiseCalendar
          teamCreateDate={teamCreateDate}
          goalDate={goalDate}
        />
      </div>

      <div className={st.promise_text_box}>
        {goalDate === null ? (
          <>
            <div className={st.promise_text}>약속 잡기 전입니다.</div>
            <div className={st.promise_text}>우리 팀 약속 시간을</div>
            <div className={st.promise_text}>정해보세요.</div>
          </>
        ) : dday < 0 ? (
          <div className={st.promise_text}>이미 만났습니다.</div>
        ) : (
          <>
            <div className={st.promise_dday}>D - {dday}</div>
            <div className={st.promise_date}>
              {goals[1]}.{goals[2]}
            </div>
            <div className={st.promise_time}>{completionHour}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Promise;
