import st from "./Button.module.css";

// 버튼 이름, 버튼 타입, onClick 함수 입력
// 예: 삭제, 200x50 파란색 버튼
// <Button text={"삭제"} type={"blue"} onClick={} />
const Button = ({ text, type, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`${st.Button} ${st[`Button_${type}`]}`}
    >
      {text}
    </button>
  );
};

export default Button;
