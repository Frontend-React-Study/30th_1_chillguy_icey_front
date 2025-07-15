import React, {
  useState,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import st from "./PromiseTime.module.css";

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
  "12:00 AM",
];

const to24Hour = (timeStr) => {
  const [hourMin, period] = timeStr.split(" ");
  let [hour, minute] = hourMin.split(":").map(Number);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;
};

const PromiseTime2 = forwardRef(
  (
    {
      allDates,
      othersVotes,
      mySelections,
      setMySelections,
      savedSelections,
      setSavedSelections,
      isEditing, // prop으로 편집 상태 받음
    },
    ref,
  ) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(allDates.length / itemsPerPage);
    const currentDates = allDates.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage,
    );

    const [dragMode, setDragMode] = useState(null);
    const [hoveredCell, setHoveredCell] = useState(null);

    const gridRef = useRef(null);

    const timeToIndex = (time24) =>
      TIME_SLOTS.findIndex((slot) => to24Hour(slot) === time24);

    useImperativeHandle(ref, () => ({
      enableEdit: () => {}, // 부모가 상태 관리, 여기선 빈 함수
      disableEdit: () => {},
      isEditing: () => isEditing, // prop으로 편집 상태 반환
      hasSaved: () =>
        JSON.stringify(mySelections) !== JSON.stringify(savedSelections),
      save: () => {
        setSavedSelections(mySelections);
        // 편집 상태 해제는 부모 컴포넌트에서 관리함
      },
    }));

    const othersSelections = useMemo(() => {
      const result = {};
      for (const { date } of allDates) {
        result[date] = [];
        for (let i = 0; i < TIME_SLOTS.length; i++) {
          const time24 = to24Hour(TIME_SLOTS[i]);
          const users = othersVotes[date]?.[time24] || [];
          users.forEach((userId) => {
            const existing = result[date].find((e) => e.userId === userId);
            if (existing) existing.selections.push(i);
            else result[date].push({ userId, selections: [i] });
          });
        }
      }
      return result;
    }, [allDates, othersVotes]);

    const handleMouseDown = (date, timeIndex) => {
      if (!isEditing) return; // 편집 중 아니면 무시
      const time24 = to24Hour(TIME_SLOTS[timeIndex]);
      const current = mySelections[date] || [];
      const isSelected = current.includes(time24);
      setDragMode(isSelected ? "remove" : "add");
      setMySelections((prev) => ({
        ...prev,
        [date]: isSelected
          ? current.filter((t) => t !== time24)
          : [...current, time24],
      }));
    };

    const handleMouseEnter = (date, timeIndex) => {
      setHoveredCell({ date, timeIndex });
      if (!isEditing || dragMode === null) return;
      const time24 = to24Hour(TIME_SLOTS[timeIndex]);
      const current = mySelections[date] || [];
      const isSelected = current.includes(time24);
      if (dragMode === "add" && !isSelected) {
        setMySelections((prev) => ({ ...prev, [date]: [...current, time24] }));
      } else if (dragMode === "remove" && isSelected) {
        setMySelections((prev) => ({
          ...prev,
          [date]: current.filter((t) => t !== time24),
        }));
      }
    };

    const getConnectedBlocks = (date) => {
      const times = mySelections[date] || [];
      const indexes = times
        .map(timeToIndex)
        .filter((i) => i !== -1)
        .sort((a, b) => a - b);
      if (!indexes.length) return [];

      const blocks = [];
      let block = [indexes[0]];
      for (let i = 1; i < indexes.length; i++) {
        if (indexes[i] === indexes[i - 1] + 1) block.push(indexes[i]);
        else {
          blocks.push(block);
          block = [indexes[i]];
        }
      }
      blocks.push(block);
      return blocks;
    };

    const getCellPosition = (date, timeIndex) => {
      for (const block of getConnectedBlocks(date)) {
        const idx = block.indexOf(timeIndex);
        if (idx !== -1) {
          return {
            isInBlock: true,
            isFirst: idx === 0,
            isLast: idx === block.length - 1,
            blockSize: block.length,
          };
        }
      }
      return { isInBlock: false };
    };

    return (
      <div className={st.container}>
        <div className={st.wrapper}>
          <div className={st.dateNav}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={`${st.chevron} ${
                currentPage === 0 ? st.disabled : ""
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <div className={st.dateList}>
              {Array.from({ length: itemsPerPage }).map((_, i) => {
                const d = currentDates[i];
                return (
                  <div
                    key={i}
                    className={st.dateItem}
                    style={{ visibility: d ? "visible" : "hidden" }}
                  >
                    {d?.date.slice(5).replace("-", ".")}
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className={`${st.chevron} ${
                currentPage === totalPages - 1 ? st.disabled : ""
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div
            ref={gridRef}
            className={st.grid}
            style={{ gridTemplateColumns: `auto repeat(${itemsPerPage}, 1fr)` }}
            onMouseUp={() => setDragMode(null)}
            onMouseLeave={() => {
              setDragMode(null);
              setHoveredCell(null);
            }}
          >
            <div className={st.timeLabels}>
              {TIME_SLOTS.map((time, i) => (
                <div key={i} className={st.time}>
                  {time}
                </div>
              ))}
            </div>

            {Array.from({ length: itemsPerPage }).map((_, colIdx) => {
              const d = currentDates[colIdx];
              return (
                <div key={colIdx} className={st.dateColumn}>
                  {TIME_SLOTS.map((_, j) => {
                    if (!d) {
                      return (
                        <div
                          key={j}
                          className={st.cell}
                          style={{ visibility: "hidden" }}
                        />
                      );
                    }

                    const mySelected = (mySelections[d.date] || []).includes(
                      to24Hour(TIME_SLOTS[j]),
                    );
                    const others = othersSelections[d.date] || [];
                    const userCount = others.filter((u) =>
                      u.selections.includes(j),
                    ).length;
                    const totalCount = mySelected ? userCount + 1 : userCount;
                    const opacity = Math.min(totalCount * 0.2, 0.8);
                    const pos = getCellPosition(d.date, j);
                    const isHovered =
                      hoveredCell?.date === d.date &&
                      hoveredCell?.timeIndex === j;

                    let borderStyle = st.defaultCell;
                    if (mySelected && isEditing && pos.isInBlock) {
                      if (pos.blockSize === 1) borderStyle = st.roundedFull;
                      else if (pos.isFirst) borderStyle = st.roundedTop;
                      else if (pos.isLast) borderStyle = st.roundedBottom;
                      else borderStyle = st.blockMiddle;
                    } else if (mySelected && isEditing) {
                      borderStyle = st.roundedFull;
                    } else if (mySelected && !isEditing) {
                      borderStyle = st.defaultCell;
                    }

                    return (
                      <div
                        key={j}
                        className={`${st.cell} ${borderStyle}`}
                        style={{
                          backgroundColor: totalCount
                            ? `rgba(89, 126, 219, ${opacity})`
                            : "white",
                          cursor: isEditing ? "pointer" : "default",
                        }}
                        onMouseDown={() => handleMouseDown(d.date, j)}
                        onMouseEnter={() => handleMouseEnter(d.date, j)}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        {isHovered && (
                          <div className={st.tooltip}>
                            <div className={st.tooltipTitle}>
                              {d.date.slice(5)} {TIME_SLOTS[j]}
                            </div>
                            <div className={st.tooltipDesc}>
                              {totalCount}명 선택
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);

export default PromiseTime2;
