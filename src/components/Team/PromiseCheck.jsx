import st from "./PromiseCheck.module.css";
import Promise from "./Promise.jsx";
import PromiseDate from "./promise/PromiseDate.jsx";
import PromiseTime from "./promise/PromiseTime.jsx";
import Button from "../Button.jsx";

const PromiseCheck = ({ userType }) => {
  if (userType === "Leader") {
    return (
      <div className={st.Promise_check_content}>
        {/* <Promise /> */}
        <div className={st.button_space}>
          <div className={st.button_section}>
            <Button text={"날짜"} type={"no"} />
            <Button text={"시간"} />
          </div>
          <div className={st.button_section}>
            <Button text={"약속 확정"} type={"promise-no"} />
            <Button text={"완료"} />
          </div>
        </div>
        <div className={st.promise_check_box}>
          <PromiseDate />
          {/* <PromiseTime /> */}
        </div>
      </div>
    );
  } else {
    return (
      <div className={st.Promise_check_content}>
        {/* <Promise /> */}
        <div className={st.button_space}>
          <div className={st.button_section}>
            {/* <Button text={"날짜"} type={"no"} /> */}
            <Button text={"시간"} />
          </div>
          <div className={st.button_section}>
            {/* <Button text={"약속 확정"} type={"promise-no"} /> */}
            <Button text={"완료"} />
          </div>
        </div>
        <div className={st.promise_check_box}>
          {/* <PromiseDate /> */}
          <PromiseTime />
        </div>
      </div>
    );
  }
};

export default PromiseCheck;
