import { Button } from "primereact/button";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import "primeicons/primeicons.css";
import SeeOriginal from "./SeeOriginal";

const ProfessionalSummary = ({ summary, summaryEmitter, originalSummary }) => {
  const [visible, setVisible] = useState(false);
  const [professionalSummary, setUpdatedSummary] = useState(summary);
  const [hoveredItem, setHoveredItem] = useState(false);

  const onSummaryChanges = (e) => {
    setUpdatedSummary(e.target.value);
  };

  const handleSave = () => {
    summaryEmitter('professionalSummary', professionalSummary);
    setVisible(false);
  };

  const handleReset = () => {
    setUpdatedSummary(summary);
  };

  const headerElement = (
    <SeeOriginal
      data={originalSummary}
      title="Professional Summary"
      width="40vw"
    ></SeeOriginal>
  );

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            backgroundColor: "white",
            paddingLeft: "5rem",
            paddingRight: "5rem",
            width: "85vw",
            paddingTop: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "lightGrey",
              marginBottom: "1rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              fontWeight: "bold",
            }}
          >
            Professional Summary
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
            onMouseEnter={() => setHoveredItem(true)}
            onMouseLeave={() => setHoveredItem(false)}
          >
            <div style={{ width: "98%", opacity: 0.8, fontSize: "1rem" }}>
              {summary}
            </div>
            <div
              style={{
                width: "2%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {hoveredItem && (
                <i
                  className="pi pi-pencil"
                  onClick={() => setVisible(true)}
                  style={{
                    fontSize: "1.1rem",
                    color: "gray",
                    cursor: "pointer",
                    alignSelf: "flex-start",
                  }}
                ></i>
              )}
            </div>
          </div>
        </div>
        <Dialog
          draggable={false}
          header={headerElement}
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => {
            if (!visible) return;
            handleReset();
            setVisible(false);
          }}
        >
          <div
            style={{
              padding: "1rem",
              paddingTop: "0",
            }}
          >
            <InputTextarea
              rows={10}
              autoResize="false"
              name="summary"
              value={professionalSummary}
              onChange={onSummaryChanges}
              placeholder="professional Summary"
              style={{
                resize: "none",
                textAlign: "justify",
                width: "100%",
                marginTop: "1rem",
              }}
            />
            <div style={{ marginTop: "1rem" }}>
              <Button
                label="Save"
                outlined
                style={{
                  width: "122px",
                  borderRadius: "5px",
                  borderColor: "#c2257c",
                  color: "#c2257c",
                }}
                onClick={handleSave}
              />
              <Button
                label="Reset"
                outlined
                style={{
                  width: "122px",
                  borderRadius: "5px",
                  borderColor: "#1a4879",
                  color: "#1a4879",
                  marginLeft: "1rem",
                }}
                onClick={handleReset}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ProfessionalSummary;
