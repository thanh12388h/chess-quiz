// Đây là dữ liệu câu hỏi - bạn thêm/sửa thoải mái
export const questions = [
  {
    id: 1,
    fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
    // FEN là "ảnh chụp" thế cờ. Lấy thêm tại lichess.org
    player: "Garry Kasparov",
    year: 1997,
    choices: ["Nf6", "d6", "Bc5", "h6"],
    correct: "Nf6",
    explanation: "Kasparov chọn Nf6 để tấn công quân tốt e4, đồng thời phát triển quân Mã ra vị trí trung tâm mạnh.",
    points: 100
  },
  {
    id: 2,
    fen: "rnbqk2r/ppp2ppp/3bpn2/3p4/2PP4/2N2N2/PP2PPPP/R1BQKB1R w KQkq - 2 6",
    player: "Magnus Carlsen",
    year: 2013,
    choices: ["e4", "Bg5", "cxd5", "Qb3"],
    correct: "Bg5",
    explanation: "Magnus ghim quân Mã f6 — nước đi kinh điển trong khai cuộc Đầu hàng Tatar.",
    points: 150
  },
  {
    id: 3,
    fen: "2r3k1/5ppp/p7/1p6/3B4/1P4P1/P4PKP/8 w - - 0 28",
    player: "Bobby Fischer",
    year: 1971,
    choices: ["Bc5", "Bd8", "Ba7", "Bf6"],
    correct: "Bc5",
    explanation: "Fischer dùng Tượng để cô lập tốt b5, tiến hành tàn cuộc hoàn hảo theo phong cách đặc trưng của ông.",
    points: 200
  },
];