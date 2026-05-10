import { useState, useEffect, useRef } from "react";
import { Chessboard } from "react-chessboard";

// ============================================================
// DATA — 12 câu hỏi từ các ván đấu lịch sử có thật
// FEN được lấy từ các thời điểm quan trọng trong ván đấu
// ============================================================
const QUESTIONS = [
  {
    id: 1,
    gameName: "The Immortal Game",
    white: "Adolf Anderssen",
    black: "Lionel Kieseritzky",
    year: 1851,
    tournament: "London Tournament (informal)",
    moveNumber: 18,
    side: "white",
    // Position before Anderssen's legendary Bd6!! sacrifice
    fen: "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 w - - 1 18",
    question: "Anderssen (Trắng) vừa tấn công ồ ạt. Nước đi huyền thoại nào khiến ván này được gọi là 'The Immortal Game'?",
    choices: ["Bd6", "Re1", "d4", "Be3"],
    correct: "Bd6",
    explanation: "Bd6!! — Anderssen hi sinh ĐỒNG THỜI cả hai xe! Đây là nước đi táo bạo nhất lịch sử cờ vua, hi sinh vật chất khổng lồ để duy trì thế tấn công. Ván này được Ernst Falkbeer đặt tên 'Immortal Game' năm 1855.",
    difficulty: "hard",
    points: 300,
    timeBonus: true,
    funFact: "Kieseritzky ấn tượng đến mức tự tay điện báo các nước đi về câu lạc bộ cờ tại Paris!"
  },
  {
    id: 2,
    gameName: "The Opera Game",
    white: "Paul Morphy",
    black: "Duke Karl & Count Isouard",
    year: 1858,
    tournament: "Paris Opera House",
    moveNumber: 16,
    side: "white",
    // Position before Morphy's famous Qb8+!! queen sacrifice
    fen: "1n2kb1r/p4ppp/4q3/4p1B1/4P3/8/PPP2PPP/2KR3R w k - 0 16",
    question: "Morphy (Trắng) đang chơi ván cờ... tại nhà hát Opera Paris! Nước hi sinh Hậu nào kết thúc ván đấu trong 1 nước?",
    choices: ["Qb8+", "Rd8+", "Bxf6", "h4"],
    correct: "Qb8+",
    explanation: "Qb8+!! — Hi sinh Hậu buộc Vua đen phải ăn, sau đó Rd8# chiếu hết! Morphy phát triển quân hoàn hảo trong khi đối phương lãng phí thời gian. Ván này là bài học kinh điển về phát triển quân.",
    difficulty: "medium",
    points: 200,
    timeBonus: true,
    funFact: "Morphy bỏ dở buổi biểu diễn Opera để đánh ván cờ này — và hoàn thành chỉ trong 17 nước!"
  },
  {
    id: 3,
    gameName: "Game of the Century",
    white: "Donald Byrne",
    black: "Bobby Fischer",
    year: 1956,
    tournament: "Rosenwald Memorial, New York",
    moveNumber: 17,
    side: "black",
    // Position before Fischer's famous queen sacrifice Be6+
    fen: "r4rk1/pp2ppbp/1qp3p1/8/1Q1PP3/2N2P2/PP4PP/R1B2RK1 b - - 0 17",
    question: "Fischer 13 tuổi (Đen) vừa nhìn thấy một tổ hợp thiên tài. Nước nào bắt đầu chuỗi hi sinh Hậu huyền thoại?",
    choices: ["Be6", "Qb4", "Rfe8", "Na6"],
    correct: "Be6",
    explanation: "Be6!! — Fischer hi sinh Hậu bằng cách đẩy Tượng vào vị trí bị ăn! Byrne buộc phải nhận Hậu nhưng Fischer thu về Xe + 2 Tượng + Tốt và chiếu hết sau đó. Hans Kmoch gọi đây là 'Game of the Century'.",
    difficulty: "hard",
    points: 350,
    timeBonus: true,
    funFact: "Các kiện tướng đang xem ván cho rằng Fischer đang thua — cho đến khi họ nhận ra toàn bộ kế hoạch!"
  },
  {
    id: 4,
    gameName: "Kasparov's Immortal",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    year: 1999,
    tournament: "Hoogovens Tournament, Wijk aan Zee",
    moveNumber: 24,
    side: "white",
    // Position before the famous Rxd4!! rook sacrifice
    fen: "r3r1k1/1p3pbp/p1n1b1p1/q1Pp4/3P4/2N1BN2/PP2QPPP/R4RK1 w - - 0 24",
    question: "Kasparov (Trắng) chuẩn bị hi sinh Xe — nước đi mở đầu cho tổ hợp 15 nước được coi là đẹp nhất thế kỷ 20?",
    choices: ["Rxd4", "Nd5", "Rf6", "b4"],
    correct: "Rxd4",
    explanation: "Rxd4!! — Kasparov hi sinh Xe vào trung tâm! Đây là khởi đầu của tổ hợp 15 nước liên tiếp, được gọi là 'Kasparov's Immortal'. Ván đấu được bình luận nhiều nhất lịch sử cờ vua.",
    difficulty: "hard",
    points: 350,
    timeBonus: true,
    funFact: "Kasparov mất 15 phút suy nghĩ trước Rxd4 — và kết quả là kiệt tác đẹp nhất sự nghiệp ông!"
  },
  {
    id: 5,
    gameName: "Deep Blue vs Kasparov — Game 2",
    white: "Deep Blue (IBM)",
    black: "Garry Kasparov",
    year: 1997,
    tournament: "Man vs Machine, New York",
    moveNumber: 36,
    side: "white",
    // Key position where Deep Blue played the legendary Be4 surprise
    fen: "1r6/2p5/p3k3/4p1p1/1P6/P4nP1/5P2/1R3BK1 w - - 0 37",
    question: "Deep Blue (Trắng) cần một nước 'human' để thắng. Máy đã chơi nước nào khiến Kasparov sốc đến nỗi bỏ cuộc ngay?",
    choices: ["Ba6", "Bd3", "Rb3", "f4"],
    correct: "Ba6",
    explanation: "Ba6!! — Deep Blue đi Tượng lên a6 — một nước cực kỳ tinh tế, không thể tính ngay tức thì. Kasparov bỏ cuộc sau 1 nước! Đây là lần đầu tiên máy tính đánh bại Nhà vô địch thế giới trong một trận đấu chính thức.",
    difficulty: "hard",
    points: 300,
    timeBonus: false,
    funFact: "Kasparov sau đó cáo buộc IBM gian lận vì tin rằng con người đã can thiệp vào nước Ba6!"
  },
  {
    id: 6,
    gameName: "Karpov vs Kasparov — Game 16, 1985 WCh",
    white: "Anatoly Karpov",
    black: "Garry Kasparov",
    year: 1985,
    tournament: "World Championship, Moscow",
    moveNumber: 20,
    side: "black",
    // Position before Kasparov's famous knight centralization
    fen: "r1bq1rk1/1p2bppp/p1n1pn2/3pN3/2PP4/2N1BP2/PP2BPPP/R2QK2R b KQ - 0 10",
    question: "Kasparov (Đen) cần một nước tấn công trung tâm táo bạo. Nước nào giúp ông trở thành Nhà vô địch thế giới trẻ nhất lúc đó?",
    choices: ["d4", "Nd4", "Nxe5", "Nb4"],
    correct: "d4",
    explanation: "d4!! — Tốt đẩy mạnh vào trung tâm, phá vỡ cấu trúc của Karpov. Kasparov đã lên kế hoạch chuỗi khai cuộc này từ hàng tuần trước. Ông thắng ván và trở thành Nhà vô địch thế giới lúc 22 tuổi.",
    difficulty: "medium",
    points: 250,
    timeBonus: true,
    funFact: "Khoảnh khắc Kasparov thắng ván này, Vua Liên Xô Mikhail Gorbachev đang xem trực tiếp trên TV!"
  },
  {
    id: 7,
    gameName: "Fischer vs Spassky — Game 6, 1972 WCh",
    white: "Bobby Fischer",
    black: "Boris Spassky",
    year: 1972,
    tournament: "World Championship, Reykjavik",
    moveNumber: 21,
    side: "white",
    // Position where Fischer plays the famous queenside rook maneuver
    fen: "r4rk1/1p1n1ppp/p3pn2/q7/3P4/2PBP3/PP1N1PPP/R2QR1K1 w - - 0 21",
    question: "Fischer (Trắng) đang thực hiện 'cuộc tấn công Hậu cánh đẹp nhất'. Nước Xe nào mang lại lợi thế quyết định?",
    choices: ["Re2", "Rb1", "Ra2", "Re3"],
    correct: "Re2",
    explanation: "Re2! — Fischer chuyển Xe để kết hợp sức mạnh trên trục e. Ván 6 được coi là ván đẹp nhất trong 'Trận đấu thế kỷ' Fischer vs Spassky. Spassky vỗ tay công nhận Fischer sau khi thua!",
    difficulty: "medium",
    points: 200,
    timeBonus: true,
    funFact: "Boris Spassky là người duy nhất đứng dậy vỗ tay tán thưởng Fischer — ngay khi vừa thua chính ông ta!"
  },
  {
    id: 8,
    gameName: "Carlsen vs Anand — Game 9, 2013 WCh",
    white: "Viswanathan Anand",
    black: "Magnus Carlsen",
    year: 2013,
    tournament: "World Championship, Chennai",
    moveNumber: 28,
    side: "white",
    // Anand's position before blunder that cost him the championship
    fen: "6k1/5pp1/7p/4P1n1/1p6/1Pr5/P4PPP/3R2K1 w - - 0 28",
    question: "Anand (Trắng) cần giữ thế. Ông đã chơi Kh1 — nhưng nước nào đúng để cầm hòa?",
    choices: ["Kh2", "f4", "Re1", "Rd7"],
    correct: "Kh2",
    explanation: "Kh2! là nước cầm hòa đúng — nhưng Anand đã chơi Kh1?? (blunder!). Sau lỗi đó Carlsen thắng và trở thành Nhà vô địch thế giới thứ 16. Anand nói đây là sai lầm đau đớn nhất sự nghiệp ông.",
    difficulty: "easy",
    points: 150,
    timeBonus: false,
    funFact: "Carlsen 22 tuổi, trở thành vô địch thế giới, với rating đỉnh 2882 — cao nhất lịch sử cho đến nay!"
  },
  {
    id: 9,
    gameName: "Tal vs Spassky — Bled 1958",
    white: "Mikhail Tal",
    black: "Boris Spassky",
    year: 1958,
    tournament: "Candidates Tournament, Portoroz",
    moveNumber: 15,
    side: "white",
    // Tal's attacking position
    fen: "r1bqk2r/ppp2ppp/2np1n2/4p3/2B1P3/2PP1N2/PP3PPP/RNBQK2R w KQkq - 0 7",
    question: "Mikhail Tal — 'Phù thủy từ Riga' — luôn chọn cách tấn công. Trong khai cuộc Hai Mã, ông sẽ chơi gì?",
    choices: ["Ng5", "d4", "Bb3", "O-O"],
    correct: "Ng5",
    explanation: "Ng5! — Tal luôn chọn nước tạo ra đe dọa ngay lập tức! Mã nhảy lên g5 đe dọa f7, buộc đối thủ phải phản ứng. Tal có phong cách tấn công hỗn loạn nhất lịch sử — ông nói 'đôi khi tôi cũng không thấy hết biến'!",
    difficulty: "easy",
    points: 100,
    timeBonus: true,
    funFact: "Tal được mô tả có 'ánh mắt ma quái' — đối thủ thường bị rối loạn chỉ vì nhìn vào mắt ông trước khi đánh!"
  },
  {
    id: 10,
    gameName: "Morphy vs Anderssen — 1858",
    white: "Paul Morphy",
    black: "Adolf Anderssen",
    year: 1858,
    tournament: "Paris Match",
    moveNumber: 23,
    side: "white",
    // Classic attacking position
    fen: "r3kb1r/p1q2ppp/2p1pn2/8/Q1pP4/2N1PN2/PP3PPP/R1B1K2R w KQkq - 0 12",
    question: "Morphy (Trắng) đang có ưu thế phát triển quân mạnh. Nước nào nhất quán với phong cách 'phát triển trước, tấn công sau'?",
    choices: ["O-O", "Nd5", "Qxa7", "Bg5"],
    correct: "Bg5",
    explanation: "Bg5! — Morphy ghim Mã f6, phát triển Tượng và tạo áp lực cùng lúc. Morphy là người đầu tiên hiểu rõ nguyên lý phát triển quân trong khai cuộc — triết lý của ông ảnh hưởng đến cờ vua hiện đại 160 năm sau!",
    difficulty: "easy",
    points: 100,
    timeBonus: true,
    funFact: "Morphy từng đề nghị Anderssen — Vô địch thế giới khi đó — được thêm quân Tốt để bình đẳng hơn!"
  },
  {
    id: 11,
    gameName: "Judit Polgar vs Kasparov — Dos Hermanas",
    white: "Judit Polgar",
    black: "Garry Kasparov",
    year: 1994,
    tournament: "Dos Hermanas Tournament",
    moveNumber: 32,
    side: "white",
    // Critical position in this famous game
    fen: "6k1/5p1p/4p1p1/3rP1P1/p2R3P/P7/1r3PK1/3R4 w - - 0 32",
    question: "Judit Polgar (Trắng) — người phụ nữ vĩ đại nhất lịch sử cờ vua — đang trong thế tàn cuộc. Nước nào tốt nhất?",
    choices: ["h5", "Rd8+", "f4", "Rdd4"],
    correct: "h5",
    explanation: "h5! — Đẩy tốt thông vào Vua đối phương! Polgar là nữ kỳ thủ duy nhất lọt vào Top 10 thế giới. Bà đánh bại Kasparov trong ván này — Kasparov từng nói 'phụ nữ không thể chơi cờ ở đẳng cấp cao' và bị bác bỏ!",
    difficulty: "medium",
    points: 200,
    timeBonus: false,
    funFact: "Cha của Polgar đã chứng minh 'thiên tài có thể được tạo ra' bằng cách dạy 3 con gái trở thành Kiện tướng Quốc tế!"
  },
  {
    id: 12,
    gameName: "The Evergreen Game",
    white: "Adolf Anderssen",
    black: "Jean Dufresne",
    year: 1852,
    tournament: "Berlin (casual game)",
    moveNumber: 19,
    side: "white",
    // Before the spectacular Rxe7+ sacrifice
    fen: "r1bk3r/pPp2Npp/8/2p5/2B5/p1B5/P4PPP/R4RK1 w - - 0 19",
    question: "Anderssen (Trắng) tung ra 'Evergreen Game' — ván cờ xanh tươi mãi mãi. Nước mở đầu tổ hợp chiếu hết đẹp nhất là gì?",
    choices: ["Rxe7+", "Qd8+", "Rxf7+", "Bb6"],
    correct: "Rxe7+",
    explanation: "Rxe7+!! — Hi sinh Xe buộc Vua phải lộ diện, sau đó Qd8+! Rxd8 Rxd8# chiếu hết với Xe! Ván này được Wilhelm Steinitz bình luận là 'ván cờ đẹp nhất thế kỷ 19' và vẫn được dạy trong mọi sách cờ.",
    difficulty: "hard",
    points: 300,
    timeBonus: true,
    funFact: "Cả hai ván Immortal Game và Evergreen Game đều là ván cờ... không chính thức! Anderssen chơi casual với bạn bè!"
  }
];

const TOTAL_TIME = 30 * 60; // 30 phút tính bằng giây

// ============================================================
// UTILITY
// ============================================================
function formatTime(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getDifficultyLabel(d) {
  return { easy: "Dễ", medium: "Trung bình", hard: "Khó" }[d];
}
function getDifficultyColor(d) {
  return { easy: "#4ade80", medium: "#fbbf24", hard: "#f87171" }[d];
}

// ============================================================
// COMPONENT: Leaderboard panel
// ============================================================
function LeaderboardPanel({ entries, currentName }) {
  const sorted = [...entries].sort((a, b) =>
    b.score !== a.score ? b.score - a.score : a.elapsed - b.elapsed
  );
  return (
    <div style={lb.wrap}>
      <div style={lb.title}>🏆 Bảng xếp hạng</div>
      {sorted.length === 0 && <div style={lb.empty}>Chưa có ai hoàn thành</div>}
      {sorted.map((e, i) => (
        <div key={e.name} style={{ ...lb.row, background: e.name === currentName ? "rgba(250,204,21,0.13)" : "rgba(255,255,255,0.04)", borderLeft: e.name === currentName ? "3px solid #facc15" : "3px solid transparent" }}>
          <span style={{ ...lb.rank, color: i === 0 ? "#facc15" : i === 1 ? "#c0c0c0" : i === 2 ? "#cd7f32" : "#888" }}>
            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
          </span>
          <span style={lb.name}>{e.name}{e.name === currentName ? " (bạn)" : ""}</span>
          <span style={lb.score}>{e.score.toLocaleString()}</span>
          <span style={lb.time}>{formatTime(e.elapsed)}</span>
        </div>
      ))}
    </div>
  );
}
const lb = {
  wrap: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 12px", minWidth: 220 },
  title: { fontSize: 13, fontWeight: 700, color: "#facc15", marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" },
  empty: { fontSize: 12, color: "#555", textAlign: "center", padding: "12px 0" },
  row: { display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 8, marginBottom: 4 },
  rank: { width: 28, fontSize: 14, fontWeight: 700, textAlign: "center", flexShrink: 0 },
  name: { flex: 1, fontSize: 12, color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  score: { fontSize: 13, fontWeight: 700, color: "#facc15", flexShrink: 0 },
  time: { fontSize: 11, color: "#666", flexShrink: 0, marginLeft: 4 },
};

// ============================================================
// COMPONENT: Question card
// ============================================================
function QuestionCard({ q, onAnswer, answered, selectedChoice, timeLeft }) {
  const choiceLabels = ["A", "B", "C", "D"];
  return (
    <div style={qc.wrap}>
      {/* Game name badge */}
      <div style={qc.badge}>
        <span style={{ ...qc.diff, background: getDifficultyColor(q.difficulty) + "22", color: getDifficultyColor(q.difficulty), border: `1px solid ${getDifficultyColor(q.difficulty)}44` }}>
          {getDifficultyLabel(q.difficulty)}
        </span>
        <span style={qc.gameName}>{q.gameName}</span>
        <span style={qc.pts}>+{q.points}đ</span>
      </div>

      {/* Players */}
      <div style={qc.players}>
        <span style={qc.white}>⬜ {q.white}</span>
        <span style={qc.vs}>vs</span>
        <span style={qc.black}>⬛ {q.black}</span>
        <span style={qc.year}>{q.year}</span>
      </div>

      {/* Tournament */}
      <div style={qc.tournament}>{q.tournament} · Nước {q.moveNumber}</div>

      {/* Question */}
      <p style={qc.question}>{q.question}</p>

      {/* Choices */}
      <div style={qc.grid}>
        {q.choices.map((c, i) => {
          let bg = "rgba(255,255,255,0.06)";
          let border = "rgba(255,255,255,0.12)";
          let color = "#e5e7eb";
          if (answered) {
            if (c === q.correct) { bg = "rgba(74,222,128,0.15)"; border = "#4ade80"; color = "#4ade80"; }
            else if (c === selectedChoice) { bg = "rgba(248,113,113,0.15)"; border = "#f87171"; color = "#f87171"; }
            else { bg = "rgba(0,0,0,0.1)"; color = "#555"; }
          }
          return (
            <button key={c} onClick={() => !answered && onAnswer(c)}
              style={{ ...qc.choice, background: bg, border: `1.5px solid ${border}`, color, cursor: answered ? "default" : "pointer", transform: !answered ? undefined : "none" }}>
              <span style={qc.choiceLetter}>{choiceLabels[i]}</span>
              <span style={qc.choiceText}>{c}</span>
              {answered && c === q.correct && <span style={{ marginLeft: "auto" }}>✓</span>}
              {answered && c === selectedChoice && c !== q.correct && <span style={{ marginLeft: "auto" }}>✗</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
const qc = {
  wrap: { display: "flex", flexDirection: "column", gap: 10 },
  badge: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" },
  diff: { fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 },
  gameName: { fontSize: 13, color: "#a78bfa", fontWeight: 600 },
  pts: { marginLeft: "auto", fontSize: 13, color: "#facc15", fontWeight: 700 },
  players: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  white: { fontSize: 13, color: "#f0f0f0", fontWeight: 600 },
  black: { fontSize: 13, color: "#f0f0f0", fontWeight: 600 },
  vs: { fontSize: 11, color: "#666" },
  year: { fontSize: 11, color: "#555", marginLeft: 4, background: "rgba(255,255,255,0.06)", padding: "1px 7px", borderRadius: 10 },
  tournament: { fontSize: 11, color: "#6b7280", fontStyle: "italic" },
  question: { fontSize: 14, color: "#e5e7eb", lineHeight: 1.6, margin: "4px 0 8px" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  choice: { display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600, textAlign: "left", transition: "all 0.15s", outline: "none" },
  choiceLetter: { width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 },
  choiceText: { flex: 1 },
};

// ============================================================
// COMPONENT: Explanation box
// ============================================================
function ExplanationBox({ q, selected, pointsEarned, onNext, isLast }) {
  const correct = selected === q.correct;
  return (
    <div style={{ background: correct ? "rgba(74,222,128,0.08)" : "rgba(248,113,113,0.08)", border: `1px solid ${correct ? "#4ade8040" : "#f8717140"}`, borderRadius: 14, padding: 16, marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{correct ? "✅" : "❌"}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: correct ? "#4ade80" : "#f87171" }}>
          {correct ? `Chính xác! +${pointsEarned} điểm` : `Sai rồi! Đáp án: ${q.correct}`}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.7, margin: "0 0 10px" }}>{q.explanation}</p>
      <div style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>💡 Bạn có biết? </span>
        <span style={{ fontSize: 12, color: "#c4b5fd" }}>{q.funFact}</span>
      </div>
      <button onClick={onNext} style={{ background: "#7c3aed", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, padding: "10px 24px", cursor: "pointer", width: "100%" }}>
        {isLast ? "Xem kết quả 🏆" : "Câu tiếp →"}
      </button>
    </div>
  );
}

// ============================================================
// SCREEN: Login
// ============================================================
function LoginScreen({ onStart }) {
  const [name, setName] = useState("");
  return (
    <div style={s.loginWrap}>
      <div style={s.loginCard}>
        <div style={s.logoRow}>
          <span style={s.logoIcon}>♟</span>
          <div>
            <div style={s.logoTitle}>Whose Move Is It?</div>
            <div style={s.logoSub}>Đoán nước đi của các kỳ thủ huyền thoại</div>
          </div>
        </div>
        <div style={s.statsRow}>
          <div style={s.statBox}><span style={s.statNum}>12</span><span style={s.statLabel}>câu hỏi</span></div>
          <div style={s.statBox}><span style={s.statNum}>30</span><span style={s.statLabel}>phút</span></div>
          <div style={s.statBox}><span style={s.statNum}>2500+</span><span style={s.statLabel}>điểm tối đa</span></div>
        </div>
        <div style={s.legendRow}>
          {["Fischer", "Kasparov", "Carlsen", "Morphy", "Tal", "Polgar"].map(n => (
            <span key={n} style={s.legendTag}>{n}</span>
          ))}
        </div>
        <input placeholder="Nhập tên của bạn để bắt đầu..."
          value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onStart(name.trim())}
          style={s.input} autoFocus />
        <button onClick={() => name.trim() && onStart(name.trim())} disabled={!name.trim()} style={{ ...s.startBtn, opacity: name.trim() ? 1 : 0.5 }}>
          Bắt đầu chơi →
        </button>
        <p style={s.hint}>Điểm cao nhất trong thời gian ngắn nhất = Vô địch 🏆</p>
      </div>
    </div>
  );
}

// ============================================================
// SCREEN: Result
// ============================================================
function ResultScreen({ name, score, elapsed, correctCount, leaderboard, onReplay }) {
  const rank = [...leaderboard].sort((a, b) => b.score !== a.score ? b.score - a.score : a.elapsed - b.elapsed).findIndex(e => e.name === name) + 1;
  const maxScore = QUESTIONS.reduce((s, q) => s + q.points, 0);
  const pct = Math.round((score / maxScore) * 100);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div style={s.resultWrap}>
      <div style={s.resultCard}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>{rank <= 3 ? medals[rank - 1] : "🎖"}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#facc15", marginBottom: 4 }}>{score.toLocaleString()}</div>
        <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 20 }}>điểm · {formatTime(elapsed)} · {correctCount}/{QUESTIONS.length} đúng</div>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 16, marginBottom: 16, width: "100%", maxWidth: 320 }}>
          <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>Xếp hạng #{rank}</div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#7c3aed,#a78bfa)", borderRadius: 99 }} />
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{pct}% tổng điểm</div>
        </div>
        <LeaderboardPanel entries={leaderboard} currentName={name} />
        <button onClick={onReplay} style={{ ...s.startBtn, marginTop: 16, width: "100%", maxWidth: 320 }}>Chơi lại</button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState("login"); // login | game | result
  const [playerName, setPlayerName] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); // global 30 min timer
  const [qTimer, setQTimer] = useState(30); // per-question 30s
  const [selected, setSelected] = useState(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const startTime = useRef(null);

  const q = QUESTIONS[qIndex];
  const answered = selected !== null;

  // Global 30-min countdown
  useEffect(() => {
    if (screen !== "game") return;
    if (timeLeft <= 0) { finishGame(); return; }
    const t = setInterval(() => setTimeLeft(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [screen, timeLeft]);

  // Per-question 30s countdown
  useEffect(() => {
    if (screen !== "game" || answered) return;
    if (qTimer <= 0) { handleAnswer(null); return; }
    const t = setInterval(() => setQTimer(x => x - 1), 1000);
    return () => clearInterval(t);
  }, [screen, qTimer, answered]);

  function startGame(name) {
    setPlayerName(name);
    setScreen("game");
    startTime.current = Date.now();
  }

  function handleAnswer(choice) {
    setSelected(choice ?? "__timeout__");
    let pts = 0;
    if (choice === q.correct) {
      pts = q.points;
      if (q.timeBonus) pts += Math.round(q.points * 0.5 * (qTimer / 30));
      setCorrectCount(c => c + 1);
    }
    setPointsEarned(pts);
    setScore(s => s + pts);
  }

  function nextQuestion() {
    if (qIndex + 1 >= QUESTIONS.length) { finishGame(); return; }
    setQIndex(i => i + 1);
    setSelected(null);
    setPointsEarned(0);
    setQTimer(30);
  }

  function finishGame() {
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const finalScore = score;
    setLeaderboard(prev => {
      const next = prev.filter(e => e.name !== playerName);
      return [...next, { name: playerName, score: finalScore, elapsed }];
    });
    setScreen("result");
  }

  function replay() {
    setScreen("login");
    setQIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeLeft(TOTAL_TIME);
    setQTimer(30);
    setSelected(null);
  }

  const elapsed = startTime.current ? Math.round((Date.now() - startTime.current) / 1000) : 0;

  if (screen === "login") return <LoginScreen onStart={startGame} />;
  if (screen === "result") return <ResultScreen name={playerName} score={score} elapsed={elapsed} correctCount={correctCount} leaderboard={leaderboard} onReplay={replay} />;

  // Danger colors for timers
  const globalDanger = timeLeft < 180;
  const qDanger = qTimer <= 8;

  return (
    <div style={s.gameWrap}>
      {/* TOP BAR */}
      <div style={s.topBar}>
        <div style={s.topLeft}>
          <span style={s.logoSmall}>♟</span>
          <span style={{ fontSize: 12, color: "#6b7280" }}>Câu {qIndex + 1}/{QUESTIONS.length}</span>
        </div>
        <div style={s.topCenter}>
          <span style={{ ...s.globalTimer, color: globalDanger ? "#f87171" : "#facc15", animation: globalDanger ? "pulse 1s infinite" : "none" }}>
            ⏱ {formatTime(timeLeft)}
          </span>
        </div>
        <div style={s.topRight}>
          <span style={s.scoreDisplay}>{score.toLocaleString()} đ</span>
        </div>
      </div>

      {/* PROGRESS */}
      <div style={s.progress}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ ...s.progressDot, background: i < qIndex ? "#7c3aed" : i === qIndex ? "#a78bfa" : "rgba(255,255,255,0.1)", transform: i === qIndex ? "scaleY(1.3)" : "none" }} />
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div style={s.mainLayout}>
        {/* LEFT: Board + question */}
        <div style={s.leftCol}>
          {/* Per-question timer */}
          <div style={s.qTimerRow}>
            <div style={s.qTimerBar}>
              <div style={{ ...s.qTimerFill, width: `${(qTimer / 30) * 100}%`, background: qDanger ? "#f87171" : qTimer < 15 ? "#fbbf24" : "#4ade80", transition: "width 1s linear, background 0.5s" }} />
            </div>
            <span style={{ ...s.qTimerNum, color: qDanger ? "#f87171" : "#9ca3af" }}>{qTimer}s</span>
          </div>

          {/* Chessboard */}
          <div style={s.boardWrap}>
            <Chessboard
              position={q.fen}
              arePiecesDraggable={false}
              boardWidth={Math.min(340, window.innerWidth - 48)}
              customDarkSquareStyle={{ backgroundColor: "#4a3728" }}
              customLightSquareStyle={{ backgroundColor: "#e8d5b0" }}
            />
            <div style={s.boardLabel}>
              {q.side === "white" ? "⬜ Trắng đi" : "⬛ Đen đi"} • Nước {q.moveNumber}
            </div>
          </div>

          {/* Question + choices */}
          <QuestionCard q={q} onAnswer={handleAnswer} answered={answered} selectedChoice={selected} timeLeft={qTimer} />

          {/* Explanation */}
          {answered && (
            <ExplanationBox q={q} selected={selected} pointsEarned={pointsEarned} onNext={nextQuestion} isLast={qIndex + 1 >= QUESTIONS.length} />
          )}
        </div>

        {/* RIGHT: Leaderboard */}
        <div style={s.rightCol}>
          <LeaderboardPanel entries={leaderboard} currentName={playerName} />
          <div style={s.playerInfo}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Người chơi</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#e5e7eb" }}>♟ {playerName}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#facc15", marginTop: 4 }}>{score.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: "#555" }}>điểm tích lũy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// GLOBAL STYLES
// ============================================================
const s = {
  // Login
  loginWrap: { minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Georgia', serif" },
  loginCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16, maxWidth: 420, width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "40px 32px" },
  logoRow: { display: "flex", alignItems: "center", gap: 16, marginBottom: 8 },
  logoIcon: { fontSize: 52, lineHeight: 1 },
  logoTitle: { fontSize: 26, fontWeight: 800, color: "#f9fafb", letterSpacing: -0.5 },
  logoSub: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  statsRow: { display: "flex", gap: 12, width: "100%" },
  statBox: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", borderRadius: 12, padding: "12px 8px", gap: 2 },
  statNum: { fontSize: 22, fontWeight: 800, color: "#a78bfa" },
  statLabel: { fontSize: 11, color: "#7c3aed", fontWeight: 600 },
  legendRow: { display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  legendTag: { fontSize: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af", padding: "3px 10px", borderRadius: 20 },
  input: { width: "100%", maxWidth: 340, padding: "14px 18px", background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 12, color: "#f9fafb", fontSize: 15, outline: "none", fontFamily: "Georgia, serif", boxSizing: "border-box" },
  startBtn: { background: "linear-gradient(135deg,#7c3aed,#6d28d9)", border: "none", borderRadius: 12, color: "#fff", fontSize: 16, fontWeight: 700, padding: "14px 40px", cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: 0.3 },
  hint: { fontSize: 12, color: "#4b5563", textAlign: "center", fontStyle: "italic" },

  // Game
  gameWrap: { minHeight: "100vh", background: "#0a0a0f", color: "#f9fafb", fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 10 },
  topLeft: { display: "flex", alignItems: "center", gap: 10 },
  topCenter: { display: "flex", alignItems: "center" },
  topRight: { display: "flex", alignItems: "center" },
  logoSmall: { fontSize: 22, marginRight: 2 },
  globalTimer: { fontSize: 22, fontWeight: 800, letterSpacing: 1 },
  scoreDisplay: { fontSize: 18, fontWeight: 800, color: "#facc15" },

  progress: { display: "flex", gap: 3, padding: "8px 20px", background: "rgba(0,0,0,0.2)" },
  progressDot: { flex: 1, height: 4, borderRadius: 99, transition: "all 0.3s" },

  mainLayout: { display: "flex", gap: 20, padding: "16px 20px", maxWidth: 900, margin: "0 auto", width: "100%", boxSizing: "border-box", alignItems: "flex-start" },
  leftCol: { flex: 1, display: "flex", flexDirection: "column", gap: 12, minWidth: 0 },
  rightCol: { width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 72 },

  boardWrap: { borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.6)", position: "relative" },
  boardLabel: { position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.75)", fontSize: 12, color: "#9ca3af", textAlign: "center", padding: "5px 0", fontStyle: "italic" },

  qTimerRow: { display: "flex", alignItems: "center", gap: 8 },
  qTimerBar: { flex: 1, height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 99, overflow: "hidden" },
  qTimerFill: { height: "100%", borderRadius: 99 },
  qTimerNum: { fontSize: 13, fontWeight: 700, minWidth: 28, textAlign: "right" },

  playerInfo: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 12px" },

  // Result
  resultWrap: { minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "Georgia, serif" },
  resultCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, maxWidth: 400, width: "100%" },
};
