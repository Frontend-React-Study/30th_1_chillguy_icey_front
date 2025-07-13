import React, { useState, useRef, useCallback, useEffect } from "react";
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

const PromiseTime = ({ onPrevPage, onNextPage }) => {
  const timeSlots = TIME_SLOTS;

  // 전체 날짜 데이터
  const allDates = [
    { date: "06.15" },
    { date: "06.16" },
    { date: "06.17" },
    { date: "06.18" },
    { date: "06.19" },
    { date: "06.20" },
    { date: "06.21" },
    { date: "06.22" },
    { date: "06.23" },
    { date: "06.24" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(allDates.length / itemsPerPage);

  // 현재 페이지에 표시할 날짜들
  const getCurrentDates = () => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return allDates.slice(start, end);
  };

  const [mySelections, setMySelections] = useState({});
  const [othersSelections] = useState({
    "06.15": [
      {
        userId: "user1",
        selections: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
      { userId: "user2", selections: [4, 5, 6, 7, 8, 9, 10, 11, 12] },
      { userId: "user3", selections: [6, 7, 8, 9, 10, 11] },
    ],
    "06.16": [],
    "06.17": [
      {
        userId: "user1",
        selections: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
      { userId: "user2", selections: [7, 8, 9, 10, 11, 12, 13] },
    ],
    "06.18": [
      {
        userId: "user1",
        selections: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      },
      { userId: "user2", selections: [4, 5, 6, 7, 8, 9, 10, 11, 12] },
      { userId: "user3", selections: [6, 7, 8, 9, 10, 11] },
      { userId: "user4", selections: [8, 9, 10, 11] },
    ],
    "06.19": [
      { userId: "user1", selections: [7, 8, 9, 10, 11, 12, 13, 14, 15] },
    ],
    "06.20": [
      { userId: "user1", selections: [5, 6, 7, 8, 9, 10] },
      { userId: "user2", selections: [7, 8, 9, 10, 11] },
    ],
    "06.21": [],
    "06.22": [
      { userId: "user1", selections: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
    ],
    "06.23": [
      { userId: "user1", selections: [6, 7, 8, 9, 10, 11] },
      { userId: "user2", selections: [8, 9, 10, 11, 12] },
    ],
    "06.24": [{ userId: "user1", selections: [4, 5, 6, 7, 8, 9, 10, 11] }],
  });

  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const gridRef = useRef(null);

  const handleMouseDown = (date, timeIndex) => {
    setIsDragging(true);
    const current = mySelections[date] || [];
    const isSelected = current.includes(timeIndex);
    setDragMode(isSelected ? "remove" : "add");
    setMySelections((prev) => ({
      ...prev,
      [date]: isSelected
        ? current.filter((t) => t !== timeIndex)
        : [...current, timeIndex],
    }));
  };

  const handleMouseEnter = (date, timeIndex) => {
    setHoveredCell({ date, timeIndex });
    if (!isDragging) return;
    const current = mySelections[date] || [];
    const isSelected = current.includes(timeIndex);
    if (dragMode === "add" && !isSelected) {
      setMySelections((prev) => ({
        ...prev,
        [date]: [...current, timeIndex],
      }));
    } else if (dragMode === "remove" && isSelected) {
      setMySelections((prev) => ({
        ...prev,
        [date]: current.filter((t) => t !== timeIndex),
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setDragMode(null);
    setHoveredCell(null);
  };

  const handleMouseLeaveCell = () => setHoveredCell(null);

  const getSelectedTimes = useCallback(() => {
    const result = {};
    Object.entries(mySelections).forEach(([date, indices]) => {
      if (indices.length > 0) result[date] = indices.map((i) => timeSlots[i]);
    });
    return result;
  }, [mySelections, timeSlots]);

  useEffect(() => {
    console.log("Selected times:", getSelectedTimes());
  }, [getSelectedTimes]);

  const getConnectedBlocks = (date) => {
    const sel = [...(mySelections[date] || [])].sort((a, b) => a - b);
    if (!sel.length) return [];
    const blocks = [];
    let block = [sel[0]];
    for (let i = 1; i < sel.length; i++) {
      if (sel[i] === sel[i - 1] + 1) block.push(sel[i]);
      else {
        blocks.push(block);
        block = [sel[i]];
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

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      if (onPrevPage) onPrevPage();
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      if (onNextPage) onNextPage();
    }
  };

  const currentDates = getCurrentDates();

  return (
    <div className={st.container}>
      <div className={st.wrapper}>
        {/* 페이지네이션 네비게이션 */}
        <div className={st.dateNav}>
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`${st.chevron} ${currentPage === 0 ? st.disabled : ""}`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className={st.dateList}>
            {currentDates.map((d, i) => (
              <div key={i} className={st.dateItem}>
                {d.date}
              </div>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`${st.chevron} ${currentPage === totalPages - 1 ? st.disabled : ""}`}
          >
            <ChevronRight />
          </button>
        </div>

        {/* 그리드 */}
        <div
          ref={gridRef}
          className={st.grid}
          style={{
            gridTemplateColumns: `auto repeat(${currentDates.length}, 1fr)`,
          }}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
        >
          {/* 시간 라벨 */}
          <div className={st.timeLabels}>
            {timeSlots.map((time, i) => (
              <div key={i} className={st.time}>
                {time}
              </div>
            ))}
          </div>

          {/* 날짜 컬럼들 */}
          {currentDates.map((d, i) => (
            <div key={i} className={st.dateColumn}>
              {timeSlots.map((_, j) => {
                const selected = (mySelections[d.date] || []).includes(j);
                const others = othersSelections[d.date] || [];
                const count = others.filter((u) =>
                  u.selections.includes(j),
                ).length;
                const opacity = Math.min(count * 0.2, 0.8);
                const pos = getCellPosition(d.date, j);
                const isHovered =
                  hoveredCell?.date === d.date && hoveredCell?.timeIndex === j;

                let borderStyle = st.defaultCell;
                if (selected && pos.isInBlock) {
                  if (pos.blockSize === 1) borderStyle = st.roundedFull;
                  else if (pos.isFirst) borderStyle = st.roundedTop;
                  else if (pos.isLast) borderStyle = st.roundedBottom;
                  else borderStyle = st.blockMiddle;
                } else if (selected) borderStyle = st.roundedFull;

                return (
                  <div
                    key={j}
                    className={`${st.cell} ${borderStyle}`}
                    style={{
                      backgroundColor: count
                        ? `rgba(89, 126, 219, ${opacity})`
                        : "white",
                    }}
                    onMouseDown={() => handleMouseDown(d.date, j)}
                    onMouseEnter={() => handleMouseEnter(d.date, j)}
                    onMouseLeave={handleMouseLeaveCell}
                  >
                    {isHovered && count > 0 && (
                      <div className={st.tooltip}>
                        <div className={st.tooltipTitle}>
                          {d.date} {timeSlots[j]}
                        </div>
                        <div className={st.tooltipDesc}>{count}명 선택</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className={st.summary}>
          선택된 시간:{" "}
          {Object.keys(mySelections).length > 0
            ? Object.keys(mySelections)
                .map((d) => `${d} (${mySelections[d].length}개)`)
                .join(", ")
            : "없음"}
        </div>

        <button
          className={st.submitBtn}
          onClick={() => {
            const data = getSelectedTimes();
            console.log("백엔드로 전송할 데이터:", data);
            alert("콘솔에서 전송 데이터를 확인하세요!");
          }}
        >
          선택 완료 (콘솔 확인)
        </button>
      </div>
    </div>
  );
};

export default PromiseTime;
