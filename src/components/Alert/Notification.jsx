import st from "./Notification.module.css";
import notifications from "../../assets/notifications.svg";

const Notification = ({ image, text }) => {
  //이벤트 객체
  const onClickButton = (e) => {
    console.log(e);
  };
  return (
    <button className={st.Notification} onClick={onClickButton}>
      <div className={st.Notification_inner}>
        <img className={st.Notification_icon} src={image} alt="이미지" />
        <span className={st.Notification_label}>{text}</span>
      </div>
    </button>
  );
};

export default Notification;
