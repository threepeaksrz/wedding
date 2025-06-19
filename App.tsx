import React, { useState, useEffect } from "react";
import { Users, Download, Upload, Printer, RotateCcw, Heart, Search } from "lucide-react";

// 主桌人數/客桌數量
const MAIN_SEAT = 12;
const TABLES = 14;
const SEATS = 10;
const KIDS = 3;

// 基本資料格式
function EditableSeat({ label, value, onChange, isKid, onRemove }) {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="flex flex-col items-center group">
      <div className="relative">
        <input
          className={`w-16 text-center rounded border transition-all duration-200 text-sm py-1 px-1 mb-1 shadow-sm
            ${isKid 
              ? 'bg-yellow-100 border-yellow-300 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500' 
              : 'bg-white border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-500'
            }
            ${isFocused ? 'scale-105 shadow-md' : 'hover:scale-102'}
            ${value ? 'font-medium' : 'font-normal'}
            focus:outline-none
          `}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isKid ? "兒童" : "姓名"}
          maxLength={8}
        />
        {value && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 flex items-center justify-center"
          >
            ×
          </button>
        )}
      </div>
      <span className={`text-xs ${isKid ? "text-yellow-700" : "text-gray-500"}`}>{label}</span>
      {isKid && (
        <span className="mt-1">
          <Heart size={16} className="text-yellow-600" fill="currentColor" />
        </span>
      )}
    </div>
  );
}

// 單一圓桌
function TableCircle({ tableIndex, seats, kids, onSeatChange, onKidChange, type = "normal" }) {
  const seatAngle = 360 / seats.length;
  // 主桌和客桌半徑可以微調
  const radius = type === "main" ? 132 : 120;
  const center = 160;
  const seatSize = 64;
  const seatFilled = seats.filter(x => x.trim() !== "").length;
  const kidFilled = kids.filter(x => x.trim() !== "").length;

  return (
    <div className="relative w-[320px] h-[390px] flex flex-col items-center mb-0">
      {/* 人數統計 */}
      {type !== "main" && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 flex gap-4 z-40">
          <div className="bg-blue-50 text-blue-800 rounded-full px-3 py-1 text-xs font-medium border border-blue-200 shadow">
            大人 {seatFilled}/10
          </div>
          <div className="bg-yellow-50 text-yellow-700 rounded-full px-3 py-1 text-xs font-medium border border-yellow-200 shadow">
            兒童 {kidFilled}/3
          </div>
        </div>
      )}
      {/* 主桌標籤 */}
      {type === "main" && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-4 py-1 bg-gradient-to-r from-purple-200 to-pink-200 text-lg font-bold rounded-xl text-pink-700 shadow border border-pink-200 z-40">
          主桌
        </div>
      )}
      <div className="relative w-[320px] h-[320px] bg-white rounded-2xl shadow-lg border border-gray-100">
        {/* 桌號標籤 */}
        <div className="absolute -top-7 -left-2 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl text-purple-700 text-sm font-bold shadow-md z-30 border border-purple-200">
          桌 {tableIndex + 1}
        </div>
        {/* 椅子 */}
        {seats.map((val, i) => {
          const angle = (seatAngle * i - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * radius + center;
          const y = Math.sin(angle) * radius + center;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - seatSize / 2,
                top: y - seatSize / 2,
                width: seatSize,
                height: seatSize,
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditableSeat
                label={type === "main" ? "" : `座位${i + 1}`}
                value={val}
                onChange={v => onSeatChange(i, v)}
                onRemove={() => onSeatChange(i, "")}
                isKid={false}
              />
            </div>
          );
        })}
        {/* 圓桌本體 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className={`rounded-full ${type === "main"
            ? "bg-gradient-to-br from-pink-200 via-pink-100 to-purple-100 border-4 border-pink-400"
            : "bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 border-4 border-pink-300"
            } w-[140px] h-[140px] flex flex-col items-center justify-center text-2xl font-bold text-pink-600 shadow-lg`}>
            桌 {tableIndex + 1}
            <div className="text-base font-normal text-gray-600 mt-1 text-center">
              {seatFilled + kidFilled}/{seats.length + kids.length}人
            </div>
          </div>
        </div>
      </div>
      {/* 兒童椅 */}
      {kids.length > 0 && (
        <div className="flex flex-row gap-6 mt-2">
          {kids.map((val, k) => (
            <div key={k} className="flex flex-col items-center">
              <EditableSeat
                label={`兒童${k + 1}`}
                value={val}
                onChange={v => onKidChange(k, v)}
                onRemove={() => onKidChange(k, "")}
                isKid={true}
              />
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
                <rect x="8" y="12" width="8" height="8" rx="2" fill="#FDE68A" stroke="#D97706" strokeWidth="1.2" />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 主體
export default function WeddingSeating() {
  // 主桌（12位），不含兒童
  const [mainTable, setMainTable] = useState({
    seats: Array(MAIN_SEAT).fill(""),
    kids: [],
  });
  // 14 客桌
  const [tables, setTables] = useState(
    Array.from({ length: TABLES }).map(() => ({
      seats: Array(SEATS).fill(""),
      kids: Array(KIDS).fill(""),
    }))
  );

  // localStorage: 可依你需求調整key，下面直接存「主桌」和「客桌」
  useEffect(() => {
    const main = localStorage.getItem("main-table");
    const guests = localStorage.getItem("wedding-seating-tables");
    if (main) setMainTable(JSON.parse(main));
    if (guests) setTables(JSON.parse(guests));
  }, []);
  useEffect(() => {
    localStorage.setItem("main-table", JSON.stringify(mainTable));
    localStorage.setItem("wedding-seating-tables", JSON.stringify(tables));
  }, [mainTable, tables]);

  // 編輯主桌
  const handleMainSeatChange = (seatIdx, value) => {
    setMainTable(t => {
      const arr = { ...t, seats: [...t.seats] };
      arr.seats[seatIdx] = value;
      return arr;
    });
  };

  // 編輯客桌
  const handleSeatChange = (tableIdx, seatIdx, value) => {
    setTables(tables => {
      const arr = tables.map(row => ({ seats: [...row.seats], kids: [...row.kids] }));
      arr[tableIdx].seats[seatIdx] = value;
      return arr;
    });
  };
  const handleKidChange = (tableIdx, kidIdx, value) => {
    setTables(tables => {
      const arr = tables.map(row => ({ seats: [...row.seats], kids: [...row.kids] }));
      arr[tableIdx].kids[kidIdx] = value;
      return arr;
    });
  };

  // 統計
  const totalGuests =
    mainTable.seats.filter(x => x.trim() !== "").length +
    tables.reduce(
      (sum, t) =>
        sum +
        t.seats.filter(s => s.trim() !== "").length +
        t.kids.filter(k => k.trim() !== "").length,
      0
    );
  const maxCapacity =
    mainTable.seats.length +
    tables.reduce((sum, t) => sum + t.seats.length + t.kids.length, 0);

  // 重置
  const handleReset = () => {
    if (window.confirm("確定要清空所有座位安排嗎？此操作無法復原。")) {
      setMainTable({ seats: Array(MAIN_SEAT).fill(""), kids: [] });
      setTables(Array.from({ length: TABLES }).map(() => ({
        seats: Array(SEATS).fill(""),
        kids: Array(KIDS).fill(""),
      })));
    }
  };

  // 匯出
  const handleExport = () => {
    const data = {
      mainTable,
      tables
    };
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `wedding-seating-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 匯入
  const handleImport = event => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const imported = JSON.parse(e.target?.result);
          setMainTable(imported.mainTable || { seats: Array(MAIN_SEAT).fill(""), kids: [] });
          setTables(imported.tables || Array.from({ length: TABLES }).map(() => ({
            seats: Array(SEATS).fill(""),
            kids: Array(KIDS).fill(""),
          })));
        } catch {
          alert("檔案格式錯誤，無法匯入");
        }
      };
      reader.readAsText(file);
    }
  };

  // 列印
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-pink-50 to-violet-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Heart className="text-white" fill="currentColor" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-pink-700">婚宴圓桌座位編輯器</h1>
                <p className="text-gray-600">主桌+14桌賓客桌配置，可直接編輯保存</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-600">已安排賓客</div>
                <div className="text-xl font-bold text-purple-600">
                  {totalGuests} / {maxCapacity}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handlePrint}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                  <Printer size={16} /> 列印
                </button>
                <button onClick={handleExport}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                  <Download size={16} /> 匯出
                </button>
                <label className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-xl">
                  <Upload size={16} /> 匯入
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
                <button onClick={handleReset}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
                  <RotateCcw size={16} /> 重置
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 主桌 */}
      <div className="flex flex-col items-center pt-10 pb-4">
        <TableCircle
          tableIndex={0}
          seats={mainTable.seats}
          kids={[]}
          onSeatChange={handleMainSeatChange}
          onKidChange={() => { }}
          type="main"
        />
      </div>
      {/* 客桌分左右 */}
      <div className="flex flex-row justify-center gap-20">
        {/* 左側7桌 */}
        <div className="flex flex-col gap-8">
          {tables.slice(0, 7).map((t, i) => (
            <TableCircle
              key={i}
              tableIndex={i + 1}
              seats={t.seats}
              kids={t.kids}
              onSeatChange={(seatIdx, value) => handleSeatChange(i, seatIdx, value)}
              onKidChange={(kidIdx, value) => handleKidChange(i, kidIdx, value)}
            />
          ))}
        </div>
        {/* 右側7桌 */}
        <div className="flex flex-col gap-8">
          {tables.slice(7, 14).map((t, i) => (
            <TableCircle
              key={i + 7}
              tableIndex={i + 8}
              seats={t.seats}
              kids={t.kids}
              onSeatChange={(seatIdx, value) => handleSeatChange(i + 7, seatIdx, value)}
              onKidChange={(kidIdx, value) => handleKidChange(i + 7, kidIdx, value)}
            />
          ))}
        </div>
      </div>
      {/* Print Styles */}
      <style>{`
        @media print {
          .bg-gradient-to-b { background: white !important; }
          .shadow-lg, .shadow-xl { box-shadow: none !important; }
          .border { border: 1px solid #ccc !important; }
          button, label, .cursor-pointer { display: none !important; }
        }
      `}</style>
    </div>
  );
}
