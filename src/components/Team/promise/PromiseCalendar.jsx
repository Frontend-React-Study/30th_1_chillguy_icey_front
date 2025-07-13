import React from "react";
import Calendar from "react-calendar";
import moment from "moment";
import st from "./PromiseCalendar.module.css";
import "./PromiseCalendar.css";
// import "react-calendar/dist/Calendar.css";

const PromiseCalendar = ({ goalDate }) => {
  const today = moment().format("YYYY-MM-DD");
  const goal = moment(goalDate).format("YYYY-MM-DD");

  return (
    <div className={st.calendarContainer}>
      <Calendar
        locale="en"
        calendarType="gregory"
        prev2Label={null}
        next2Label={null}
        formatDay={(locale, date) => moment(date).format("D")}
        formatShortWeekday={(locale, date) =>
          date.toLocaleDateString(locale, { weekday: "short" }).charAt(0)
        }
        formatMonthYear={(locale, date) =>
          date.toLocaleDateString(locale, { month: "short", year: "numeric" })
        }
        tileClassName={({ date }) => {
          const dateStr = moment(date).format("YYYY-MM-DD");
          if (dateStr === today) return st.today;
          if (dateStr === goal) return st.goal;
          return st.normal;
        }}
        showNavigation={true}
        onClickDay={() => {}} // 선택 효과 제거용
      />
    </div>
  );
};

export default PromiseCalendar;
