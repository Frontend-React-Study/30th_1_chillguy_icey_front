import envelope from "../../assets/envelope.svg";
import styles from "./ReceivedLetter.module.css";

// Props
// isRead: 쪽지 읽음 여부
// onClick: 쪽지 클릭 시 실행 함수
// name: 쪽지 보낸 사람 이름

const ReceivedLetter = ({ isRead, onClick, name }) => {
  return (
    <div className={styles.Receiced_letter} onClick={onClick}>
      <div className={styles.Envelope_wrapper}>
        <img className={styles.Envelop_logo} src={envelope} alt="envelope" />
        {/* 안 읽은 경우에만 Unread 표시 */}
        {!isRead && <div className={styles.Unread}></div>}
      </div>
      <div className={styles.From}>FROM. {name}</div>
    </div>
  );
};

export default ReceivedLetter;
