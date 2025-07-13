import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import st from "./PromiseDate.module.css";

const PromiseDate = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState(null);

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    // 이전 달 날짜 채우기
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i),
      });
    }

    // 현재 달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(year, month, day),
      });
    }

    // 다음 달 날짜 (최대 6주까지만 보이도록 제한)
    const maxCells = 6 * 7;
    const remainingCells = maxCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
      });
    }

    return days;
  };

  const formatDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const handleMouseDown = (dayObj) => {
    if (!dayObj.isCurrentMonth) return;
    setIsDragging(true);
    const dateKey = formatDateKey(dayObj.date);
    const isSelected = selectedDates.has(dateKey);
    setDragMode(isSelected ? "remove" : "add");
    const newSet = new Set(selectedDates);
    isSelected ? newSet.delete(dateKey) : newSet.add(dateKey);
    setSelectedDates(newSet);
  };

  const handleMouseEnter = (dayObj) => {
    if (!isDragging || !dayObj.isCurrentMonth) return;
    const dateKey = formatDateKey(dayObj.date);
    const isSelected = selectedDates.has(dateKey);
    const newSet = new Set(selectedDates);
    if (dragMode === "add" && !isSelected) newSet.add(dateKey);
    else if (dragMode === "remove" && isSelected) newSet.delete(dateKey);
    setSelectedDates(newSet);
  };

  useEffect(() => {
    const stopDrag = () => {
      setIsDragging(false);
      setDragMode(null);
    };
    document.addEventListener("mouseup", stopDrag);
    return () => document.removeEventListener("mouseup", stopDrag);
  }, []);

  const getSelectedDatesData = useCallback(() => {
    return Array.from(selectedDates)
      .map((key) => {
        const [y, m, d] = key.split("-");
        return { year: +y, month: +m, day: +d, dateKey: key };
      })
      .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }, [selectedDates]);

  useEffect(() => {
    const data = getSelectedDatesData();
    if (onDateSelect) onDateSelect(data);
  }, [getSelectedDatesData, onDateSelect]);

  const days = getDaysInMonth(currentDate);

  return (
    <div className={st.container}>
      <div className={st.wrapper}>
        <div className={st.card}>
          <div className={st.header}>
            <button className={st.arrow} onClick={handlePrevMonth}>
              <ChevronLeft size={18} />
            </button>
            <div className={st.month}>
              {currentDate.getFullYear()}.
              {String(currentDate.getMonth() + 1).padStart(2, "0")}
            </div>
            <button className={st.arrow} onClick={handleNextMonth}>
              <ChevronRight size={18} />
            </button>
          </div>

          <div className={st.grid}>
            {weekDays.map((day, i) => (
              <div key={i} className={st.weekday}>
                {day}
              </div>
            ))}

            {days.map((dayObj, i) => {
              const dateKey = formatDateKey(dayObj.date);
              const isSelected = selectedDates.has(dateKey);
              return (
                <div
                  key={i}
                  className={`${st.day} ${!dayObj.isCurrentMonth ? st.inactive : ""} ${isSelected ? st.selected : ""}`}
                  onMouseDown={() => handleMouseDown(dayObj)}
                  onMouseEnter={() => handleMouseEnter(dayObj)}
                >
                  {dayObj.day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromiseDate;
