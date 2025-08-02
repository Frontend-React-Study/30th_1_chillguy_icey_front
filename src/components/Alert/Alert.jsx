import st from "./Alert.module.css";
import event_available from "../../assets/event_available.svg";
import event from "../../assets/event.svg";
import forum from "../../assets/forum.svg";
import group_off from "../../assets/group_off.svg";
import vs from "../../assets/vs.svg";

// 백엔드의 NotificationType과 일치하도록 typeMap을 수정합니다.
const typeMap = {
  LETTER: {
    icon: forum,
    title: "쪽지 도착",
    getDescription: (team) => (
      <>
        {team}에 새로운 쪽지가 도착했습니다!
        <br />
        쪽지를 확인해보세요!
      </>
    ),
  },
  // PROMISE_CREATED -> APPOINTMENT_CREATED로 변경
  APPOINTMENT_CREATED: {
    icon: event,
    title: "약속 잡기 생성!",
    getDescription: (team) => (
      <>
        {team}에 약속잡기가 생성되었습니다.
        <br />
        약속을 확인해보세요!
      </>
    ),
  },
  // PROMISE_DONE -> APPOINTMENT_COMPLETED로 변경
  APPOINTMENT_COMPLETED: {
    icon: event_available,
    title: "약속 잡기 완료!",
    getDescription: (team) => (
      <>
        {team} 전원이 시간대를 등록했습니다.
        <br />
        약속을 확정해보세요!
      </>
    ),
  },
  // PROMISE_FIXED -> APPOINTMENT_REGISTRATION_COMPLETED로 변경
  APPOINTMENT_REGISTRATION_COMPLETED: {
    icon: event_available,
    title: "약속 잡기 확정!",
    getDescription: (team) => (
      <>
        {team}로부터 약속이 확정되었습니다.
        <br />
        약속시간을 확인해보세요!
      </>
    ),
  },
  // TEAM_DELETE_D3 -> TEAM_EXPIRATION_3로 변경
  TEAM_EXPIRATION_3: {
    icon: group_off,
    title: (team) => `${team} 삭제 예정 D-3`,
    getDescription: (team) => (
      <>
        {team} 팀 페이지 삭제까지 3일 남았어요!
        <br />
        남은 기간을 확인하세요!
      </>
    ),
  },
  // TEAM_DELETE_D1 -> TEAM_EXPIRATION_1로 변경
  TEAM_EXPIRATION_1: {
    icon: group_off,
    title: (team) => `${team} 삭제 예정 D-1`,
    getDescription: (team) => (
      <>
        {team} 팀 페이지 삭제까지 1일 남았어요!
        <br />
        남은 기간을 확인하세요!
      </>
    ),
  },
  BALANCE_GAME_CREATED: {
    icon: vs,
    title: "밸런스 게임 생성!",
    getDescription: (team) => (
      <>
        {team}에서 밸런스게임이 생성되었습니다!
        <br />팀 게시판을 확인하세요!
      </>
    ),
  },
};

const Alert = ({ type = "LETTER", team = "누군가", read = false, onClick }) => {
  const data = typeMap[type] || {};

  const icon = data.icon;
  const title =
    typeof data.title === "function" ? data.title(team) : data.title;
  const description =
    data.getDescription?.(team) ?? "알림 내용을 불러오지 못했습니다.";

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
