import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <div
      className="section section-1"
      style={{ width: "100%", margin: 0, padding: 0 }}
    >
      <div
        className="bg-section1"
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src="https://www.huce.edu.vn/theme1/images/gallery/Rectangle14.png"
          alt="DhXDHN"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </div>
  );
}
