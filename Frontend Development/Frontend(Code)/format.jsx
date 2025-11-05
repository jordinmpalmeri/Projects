import logo from "./assets/gitgoodlogo.png";

const Format = ({ leftContent, rightContent, setPage }) => {
  return (
    <div className="split-layout">
      <div className="sidebar">
        <img
          className="logo"
          src={logo}
          alt="Logo"
          onClick={() => setPage(1)}
          style={{ cursor: "pointer" }}
        />
        {leftContent}
      </div>
      <div className="mainview">{rightContent}</div>
    </div>
  );
};

export default Format;
