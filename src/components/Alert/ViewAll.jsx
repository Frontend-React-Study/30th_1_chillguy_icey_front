import va from "./ViewAll.module.css";

const ViewAll = ({ onClick }) => {
  return (
    <button className={va.ViewAll} onClick={onClick}>
      모두 읽음으로 표시
    </button>
  );
};

export default ViewAll;
