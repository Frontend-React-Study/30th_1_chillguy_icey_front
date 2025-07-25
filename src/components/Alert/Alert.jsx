import st from "./Alert.module.css";
import event_available from "../../assets/event_available.svg";
import event from "../../assets/event.svg";
import forum from "../../assets/forum.svg";
import group_off from "../../assets/group_off.svg";
import vs from "../../assets/vs.svg";

const Alert = ({ version = 1, team = "누군가", read = false, onClick }) => {
  let icon, title, description;

  switch (version) {
    case 1:
      icon = forum;
      title = "쪽지 도착";
      description = (
        <>
          {team}에 새로운 쪽지가 도착했습니다!
          <br />
          쪽지를 확인해보세요!
        </>
      );
      break;
    case 2:
      icon = event;
      title = "약속 잡기 생성!";
      description = (
        <>
          {team}에 약속잡기가 생성되었습니다.
          <br />
          약속을 확인해보세요!
        </>
      );
      break;
    case 3:
      icon = event_available;
      title = "약속 잡기 완료!";
      description = (
        <>
          {team} 전원이 가능 시간대를 등록했습니다.
          <br />
          약속을 확정해보세요!
        </>
      );
      break;
    case 4:
      icon = event_available;
      title = "약속 잡기 확정!";
      description = (
        <>
          {team}로부터 약속잡기가 확정되었습니다.
          <br />
          약속시간을 확인해보세요!
        </>
      );
      break;
    case 5:
      icon = group_off;
      title = `${team} 삭제 예정 D-3`;
      description = (
        <>
          {team} 팀 페이지 삭제까지 3일 남았어요!
          <br />
          남은 기간을 확인하세요!
        </>
      );
      break;
    case 6:
      icon = group_off;
      title = `${team} 삭제 예정 D-1`;
      description = (
        <>
          {team} 팀 페이지 삭제까지 1일 남았어요!
          <br />
          남은 기간을 확인하세요!
        </>
      );
      break;
    case 7:
      icon = vs;
      title = "밸런스 게임 생성!";
      description = (
        <>
          {team}에서 밸런스게임이 생성되었습니다!
          <br />팀 게시판을 확인하세요!
        </>
      );
      break;
  }

  return (
    <div
      className={`${st.notification} ${read ? st.read : ""}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      <div className={st.content}>
        <div className={st.header}>
          <div className={st.iconWrapper}>
            <img src={icon} alt="알림 아이콘" />
          </div>
          <div className={st.title}>{title}</div>
        </div>
        <div className={st.description}>{description}</div>
      </div>
    </div>
  );
};

export default Alert;
