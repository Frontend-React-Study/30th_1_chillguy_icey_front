import envelope from "../../assets/envelope.svg";
import styles from "./ReceivedLetter.module.css";

const ReceivedLetter = ({ isRead, onClick, Name }) => {
  return (
    <div className={styles.Receiced_letter} onClick={onClick}>
      <div className={styles.Envelope_wrapper}>
        <img className={styles.Envelop_logo} src={envelope} alt="envelope" />
        {/* 안 읽은 경우에만 Unread 표시 */}
        {!isRead && <div className={styles.Unread}></div>}
      </div>
      <div className={styles.From}>FROM. {Name}</div>
    </div>
  );
};

export default ReceivedLetter;
