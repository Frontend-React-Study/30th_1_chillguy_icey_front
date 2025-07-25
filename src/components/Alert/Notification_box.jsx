import { useState } from "react";
import st from "./Notification_box.module.css";
import Notification from "./Notification";
import Alert from "./Alert";
import ViewAll from "./ViewAll";
import person from "../../assets/person.svg";
import bell from "../../assets/notifications.svg";
import Login_Info from "../Login_Info";

const Notification_box = () => {
  const [showLoginInfo, setShowLoginInfo] = useState(false);
  const alertData = [
    { version: 1, team: "소현팀" },
    { version: 2, team: "ICEY" },
    { version: 3, team: "Frontend조" },
    { version: 4, team: "우리모임" },
  ];

  const [readList, setReadList] = useState(Array(alertData.length).fill(false));

  const handlePersonClick = () => {
    setShowLoginInfo(true);
  };

  const handleBellClick = () => {
    setShowLoginInfo(false);
  };

  const handleMarkAllAsRead = () => {
    setReadList(Array(alertData.length).fill(true));
  };

  const handleSingleRead = (index) => {
    setReadList((prev) => {
      const newList = [...prev];
      newList[index] = true;
      return newList;
    });
  };

  return (
    <div className={st.notificationBoxWrapper}>
      <div className={st.notificationBoxContent}>
        {showLoginInfo ? (
          <Login_Info onBellClick={handleBellClick} />
        ) : (
          <>
            <div className={st.notificationHeader}>
              <Notification image={bell} text="알림" />
              <div
                className={st.profileIconWrapper}
                onClick={handlePersonClick}
              >
                <div className={st.profileIcon} style={{ cursor: "pointer" }}>
                  <img src={person} alt="person" />
                </div>
              </div>
              <ViewAll onClick={handleMarkAllAsRead} />
            </div>

            <div className={st.alertListWrapper}>
              <div className={st.alertItemWrapper}>
                {alertData.map((item, index) => (
                  <Alert
                    key={index}
                    version={item.version}
                    team={item.team}
                    read={readList[index]}
                    onClick={() => handleSingleRead(index)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notification_box;
