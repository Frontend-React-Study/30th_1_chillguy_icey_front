// notificationApi.js
import axios from "axios";

// 백엔드 기본 URL (AuthContext에서 가져온 backLink와 동일하게 설정)
const BACKEND_URL =
  "https://icey-backend-1027532113913.asia-northeast3.run.app";

/**
 * 알림 관련 API 호출을 위한 유틸리티 함수들을 제공합니다.
 */
const notificationApi = {
  /**
   * 모든 알림을 읽음으로 표시합니다.
   * @param {string} token - 사용자 인증 토큰
   * @returns {Promise<any>} API 응답 데이터
   */
  markAllRead: async (token) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/notification/mark-all-read`,
        {}, // POST 요청이지만 본문이 없습니다.
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // 명시적으로 Content-Type 설정
          },
        },
      );
      console.log("모든 알림 읽음 처리 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "모든 알림 읽음 처리 실패:",
        error.response ? error.response.data : error.message,
      );
      throw error; // 에러를 호출자에게 다시 던집니다.
    }
  },

  /**
   * 알림을 브로드캐스트합니다 (관리자용 또는 특정 이벤트 발생 시).
   * @param {string} token - 사용자 인증 토큰
   * @param {string} type - 알림 타입 (예: "LETTER")
   * @param {string} teamName - 팀 이름
   * @returns {Promise<any>} API 응답 데이터
   */
  broadcast: async (token, type, teamName) => {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/notification/broadcast`,
        { type, teamName }, // 요청 본문
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      console.log("알림 브로드캐스트 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "알림 브로드캐스트 실패:",
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  },

  /**
   * 읽지 않은 알림 목록을 가져옵니다.
   * @param {string} token - 사용자 인증 토큰
   * @returns {Promise<Array<Object>>} 읽지 않은 알림 배열
   */
  getUnreadNotifications: async (token) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/notification/unread`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("읽지 않은 알림 가져오기 성공:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "읽지 않은 알림 가져오기 실패:",
        error.response ? error.response.data : error.message,
      );
      throw error;
    }
  },

  /**
   * 실시간 알림을 구독합니다 (Server-Sent Events).
   * 이 함수는 EventSource 객체를 반환하며, 이벤트 리스너를 직접 추가해야 합니다.
   * @param {string} token - 사용자 인증 토큰
   * @returns {EventSource} EventSource 객체
   * @example
   * const eventSource = notificationApi.subscribeToNotifications(yourAuthToken);
   * eventSource.onmessage = (event) => {
   * console.log("새 알림:", JSON.parse(event.data));
   * };
   * eventSource.onerror = (error) => {
   * console.error("SSE 오류:", error);
   * eventSource.close(); // 오류 발생 시 연결 종료
   * };
   * // 컴포넌트 언마운트 시 연결 종료
   * // return () => { eventSource.close(); };
   */
  subscribeToNotifications: (token) => {
    // EventSource는 axios가 아닌 브라우저 내장 API를 사용합니다.
    // 쿼리 파라미터로 토큰을 전달합니다.
    const eventSource = new EventSource(
      `${BACKEND_URL}/api/notification/subscribe?token=${token}`,
    );

    eventSource.onopen = () => {
      console.log("SSE 연결이 열렸습니다.");
    };

    // 'message' 이벤트는 서버에서 전송하는 기본 이벤트입니다.
    // 서버에서 다른 이름의 이벤트를 보낼 경우 eventSource.addEventListener('eventName', ...)를 사용해야 합니다.
    eventSource.onmessage = (event) => {
      console.log("SSE 메시지 수신:", event.data);
      // 서버에서 JSON 형태로 데이터를 보낼 경우 파싱하여 사용합니다.
      // try {
      //   const data = JSON.parse(event.data);
      //   console.log("파싱된 알림 데이터:", data);
      // } catch (e) {
      //   console.error("SSE 데이터 파싱 오류:", e);
      // }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      eventSource.close(); // 오류 발생 시 연결 종료
    };

    return eventSource;
  },
};

export default notificationApi;
