import { useState, useEffect } from "react";
// notificationApi.js에서 모든 API 함수를 가져옵니다.
import notificationApi from "../../util/NotificationAPI";
import { useAuth } from "../../context/AuthContext"; // AuthContext 훅을 가져옵니다.

import st from "./Notification_box.module.css";
import Notification from "./Notification";
import Alert from "./Alert";
import ViewAll from "./ViewAll";
import person from "../../assets/person.svg";
import bell from "../../assets/notifications.svg";
import Login_Info from "./Login_Info"; // Login_Info 경로 확인

const Notification_box = () => {
  const [showLoginInfo, setShowLoginInfo] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // readList는 더 이상 필요하지 않습니다. 알림 객체 자체가 read 상태를 가집니다.
  // const [readList, setReadList] = useState([]);

  // useAuth 훅을 사용하여 로그인 상태와 토큰을 가져옵니다.
  const { isLoggedIn, token } = useAuth();

  // API에서 읽지 않은 알림 데이터 불러오기 (로그인 상태 및 토큰 변경 시 실행)
  useEffect(() => {
    const fetchNotifications = async () => {
      // 로그인되어 있고 토큰이 있을 때만 API 호출을 시도합니다.
      if (isLoggedIn && token) {
        try {
          const fetchedNotifications =
            await notificationApi.getUnreadNotifications(token);
          // 서버에서 받은 알림 목록으로 상태를 업데이트합니다.
          setNotifications(fetchedNotifications);
        } catch (error) {
          console.error("알림 데이터 로드 실패:", error);
          setNotifications([]); // 에러 발생 시 알림 목록을 비웁니다.
          // 401 Unauthorized 에러인 경우, 토큰 만료 등으로 간주하고
          // 사용자에게 다시 로그인하라는 메시지를 표시하거나 로그인 페이지로 리다이렉트할 수 있습니다.
          if (error.response && error.response.status === 401) {
            console.log(
              "인증 토큰이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.",
            );
            // 예: navigate('/login'); // react-router-dom의 useNavigate 훅을 사용해야 함
          }
        }
      } else {
        // 로그인되어 있지 않거나 토큰이 없으면 알림 목록을 비웁니다.
        setNotifications([]);
        console.log(
          "로그인 상태가 아니거나 인증 토큰이 없어 알림을 불러올 수 없습니다.",
        );
      }
    };

    fetchNotifications();
  }, [isLoggedIn, token]); // 의존성 배열에 isLoggedIn과 token을 추가하여 상태 변경 시 재실행되도록 합니다.

  // 실시간 알림을 위한 SSE 구독
  useEffect(() => {
    let eventSource;
    if (isLoggedIn && token) {
      eventSource = notificationApi.subscribeToNotifications(token);

      eventSource.onmessage = (event) => {
        try {
          const newNotification = JSON.parse(event.data);
          console.log("새로운 실시간 알림 수신:", newNotification);
          // 새로운 알림을 기존 알림 목록의 가장 앞에 추가합니다.
          setNotifications((prevNotifications) => [
            newNotification,
            ...prevNotifications,
          ]);
        } catch (e) {
          console.error("SSE 메시지 파싱 오류:", e);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE 연결 오류:", error);
        eventSource.close(); // 오류 발생 시 연결 종료
      };
    }

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      if (eventSource) {
        eventSource.close();
        console.log("SSE 연결이 종료되었습니다.");
      }
    };
  }, [isLoggedIn, token]); // isLoggedIn 또는 token이 변경될 때 SSE 연결을 다시 설정합니다.

  const handlePersonClick = () => {
    setShowLoginInfo(true);
  };

  const handleBellClick = () => {
    setShowLoginInfo(false);
  };

  // 모든 알림을 읽음으로 표시하는 함수
  const handleMarkAllAsRead = async () => {
    if (!isLoggedIn || !token) {
      console.log(
        "로그인 상태가 아니므로 모든 알림을 읽음 처리할 수 없습니다.",
      );
      return;
    }

    try {
      await notificationApi.markAllRead(token); // notificationApi의 markAllRead 함수 호출
      console.log("전체 알림 읽음 처리 완료");
      // UI에서 모든 알림의 read 상태를 true로 업데이트하여 CSS만 변경되도록 합니다.
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) => ({ ...notif, read: true })),
      );
    } catch (error) {
      console.error("전체 알림 읽음 처리 실패:", error);
      // 에러 발생 시 사용자에게 알림을 줄 수 있습니다.
      alert("모든 알림을 읽음 처리하는 데 실패했습니다.");
    }
  };

  // 단일 알림을 읽음으로 표시하는 함수를 제거합니다.
  // const handleSingleRead = (notificationId) => {
  //   setNotifications((prevNotifications) =>
  //     prevNotifications.map((notif) =>
  //       notif.id === notificationId ? { ...notif, read: true } : notif,
  //     ),
  //   );
  //   console.log(`알림 ID ${notificationId} 읽음 처리 (UI 업데이트만)`);
  // };

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
              {/* ViewAll 컴포넌트에 읽지 않은 알림 개수를 props로 전달할 수 있습니다. */}
              <ViewAll
                onClick={handleMarkAllAsRead}
                unreadCount={notifications.filter((n) => !n.read).length} // 읽지 않은 알림 개수만 전달
              />
            </div>

            <div className={st.alertListWrapper}>
              <div className={st.alertItemWrapper}>
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <Alert
                      key={item.id}
                      type={item.type}
                      // API 응답에 teamName이 있으므로 team 대신 teamName을 사용합니다.
                      team={item.teamName}
                      // 알림 객체 자체에 read 상태가 있으므로 그대로 전달합니다.
                      read={item.read}
                      // 단일 알림 클릭 시 읽음 처리 (선택 사항)
                      // onClick={() => handleSingleRead(item.id)} // 단일 알림 클릭 핸들러 제거
                    />
                  ))
                ) : (
                  <p className={st.noNotifications}>알림이 없습니다.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Notification_box;
