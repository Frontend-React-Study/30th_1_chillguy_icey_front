import st from "./SmallTalkName.module.css";
import Snow from "../../assets/Snow.svg";
import Delete from "../Delete";
import ListLine from "../../assets/ListLine.svg";

const SmallTalkName = ({
  image = Snow,
  text = "스몰톡 제목",
  date = "2025. 05.05",
  onSelect,
  onDelete,
  isSelected, // isSelected prop을 추가했습니다.
}) => {
  return (
    // isSelected 값에 따라 조건부로 클래스를 적용합니다.
    <div className={st.div} onClick={onSelect}>
      <div className={st.title_section}>
        <img className={st.vector} src={image} alt="아이콘" />
        <div className={st.date}>{date}</div>

        {/* ✅ 제목 누르면 선택 */}
        <div className={st.title}>{text}</div>

        {/* ✅ 삭제 버튼 눌렀을 때 부모 이벤트 전달 막고 삭제 */}
        <Delete
          onClick={(e) => {
            // e가 정의되어 있고 stopPropagation 함수를 가지고 있는지 확인하여 오류 방지
            if (e && typeof e.stopPropagation === "function") {
              e.stopPropagation(); // 부모 요소의 onClick(onSelect) 이벤트가 발생하지 않도록 막습니다.
            }
            onDelete();
          }}
        />
      </div>
      <hr className={st.headerLine} />
    </div>
  );
};

export default SmallTalkName;
