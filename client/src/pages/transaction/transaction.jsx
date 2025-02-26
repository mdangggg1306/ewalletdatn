import { useState } from "react";
import Deposit from "../../components/deposit";
import Transfer from "../../components/transfer";
export default function Transaction() {
  const [selectedOption, setSelectedOption] = useState("A");

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value);
  };
  return (
    <div>
      <div
        className="transaction-header"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: "150px" }}>
          <div style={{ margin: "20px 0" }}>
            <input
              type="radio"
              name="radioOption"
              value="A"
              checked={selectedOption === "A"}
              onChange={handleRadioChange}
              id="1"
              style={{ display: "none" }}
            />
            <label
              htmlFor="1"
              style={{
                color: "white",
                background: "rgb(10, 109, 200)",
                padding: "10px 50px",
                borderRadius: "5px",
              }}
            >
              Nạp tiền
            </label>
          </div>
          <div style={{ margin: "20px 0" }}>
            <input
              type="radio"
              name="radioOption"
              value="B"
              checked={selectedOption === "B"}
              onChange={handleRadioChange}
              id="2"
              style={{ display: "none" }}
            />
            <label
              htmlFor="2"
              style={{
                color: "white",
                background: "rgb(10, 109, 200)",
                padding: "10px 50px",
                borderRadius: "5px",
              }}
            >
              Chuyển tiền
            </label>
          </div>
        </div>
      </div>
      <div
        className="transaction-body"
        style={{
          margin: "10px 100px",
          padding: "10px",
          background: "white",
          border: "1px black solid",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div>
          {selectedOption === "A" && <Deposit />}
          {selectedOption === "B" && <Transfer />}
        </div>
      </div>
    </div>
  );
}
