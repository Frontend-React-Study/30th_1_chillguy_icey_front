import st from "./Promise.module.css";
import PromiseCalendar from "./promise/PromiseCalendar.jsx";
import EXPromiseCalendar from "./promise/EXPromiseCalendar.jsx";

const Promise = () => {
  return (
    <div className={st.Promise_content}>
      <div className={st.promise_calendar_box}>
        {/* 여기에 calendar 컴포넌트 (예: react-calendar) 삽입해도 좋아요 */}
        {/* <PromiseCalendar goalDate={"2025-07-22"} /> */}
        <EXPromiseCalendar goalDate="2025-07-25" />
      </div>

      <div className={st.promise_text_box}>
        <div className={st.promise_text}>
          약속 잡기 전입니다. 우리 팀 약속 시간을 정해보세요.
        </div>
        {/* <div className={st.promise_date}>06.27</div>
        <div className={st.promise_dday}>D-15</div> */}
      </div>
    </div>
  );
};

export default Promise;
