import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, query, orderByChild, limitToLast } from "firebase/database";

const firebaseConfig = {
  // DÁN CONFIG CỦA BẠN VÀO ĐÂY
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// Lưu điểm lên Firebase
export function saveScore(name, score) {
  const key = name.replace(/\s/g, "_") + "_" + Date.now();
  set(ref(db, "scores/" + key), { name, score, time: Date.now() });
}

// Lắng nghe top 10 realtime
export function listenTopScores(callback) {
  const q = query(ref(db, "scores"), orderByChild("score"), limitToLast(10));
  onValue(q, snap => {
    const data = [];
    snap.forEach(child => data.push(child.val()));
    callback(data.reverse()); // điểm cao nhất lên đầu
  });
}