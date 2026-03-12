import { ProgressSpinner } from "primereact/progressspinner";

const progressSpinnerStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const FullPageSpinner = ({ message }) => {
  return (
    <div style={progressSpinnerStyle}>
      <ProgressSpinner animationDuration="0.5s" />
      {message && (
        <div style={{
          marginTop: 24,
          color: "#fff",
          fontSize: 20,
          fontWeight: 500,
          textAlign: "center",
          textShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>{message}</div>
      )}
    </div>
  );
};

export default FullPageSpinner;
