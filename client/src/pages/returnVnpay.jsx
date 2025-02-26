import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function Return() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    console.log(query);
    const status = query.get("status");
    console.log(status);
    const msg = query.get("msg");

    if (status === "success") {
      setResult(msg || "Nạp tiền thành công");
    } else {
      setResult(msg || "Nạp tiền thất bại");
    }

    setLoading(false);
  }, [location.search]);

  return (
    <div className="container">
      {loading ? (
        <p style={{ textAlign: "center" }}>Đang xử lý...</p>
      ) : (
        <>
          <p style={{ textAlign: "center", color: "red" }}>{result}</p>{" "}
          {/* Hiển thị kết quả */}
          <p style={{ textAlign: "center" }}>
            <a href="/homepage" className="btn btn-default">
              Quay về trang chủ
            </a>
          </p>
        </>
      )}
    </div>
  );
}
