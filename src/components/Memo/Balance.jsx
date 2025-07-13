import st from "./Balance.module.css";
import balance_line from "../../assets/memo_line.svg";
import balance_delete from "../../assets/memo_delete.svg";
import balance_vs from "../../assets/balance_vs.svg";
import balance_button from "../../assets/balance_button.svg";

const Balance = () => {
  return (
    <div className={st.Balance}>
      <div className={st.Balance_tools}>
        <img
          className={st.Balance_delete_img}
          src={balance_delete}
          alt="balance_delete"
        />
      </div>
      <img
        className={st.Balance_line_img}
        src={balance_line}
        alt="balance_line"
      />
      <div className={st.Button_wrapper}>
        <button className={st.Blance_button}>
          <img
            className={st.Balance_button_img}
            src={balance_button}
            alt="balance_button"
          />
          <span className={`${st.Balance_count} ${st.one}`}>5</span>
          <span className={st.Balance_text}>짜장면</span>
        </button>
        <img className={st.Balance_vs_img} src={balance_vs} alt="balance_vs" />
        <button className={st.Blance_button}>
          <img
            className={st.Balance_button_img}
            src={balance_button}
            alt="balance_button"
          />
          <span className={`${st.Balance_count} ${st.two}`}>3</span>
          <span className={st.Balance_text}>짬뽕</span>
        </button>
      </div>
    </div>
  );
};

export default Balance;
