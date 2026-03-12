import { useState } from "react";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import SeeOriginal from "./SeeOriginal";

const Header = ({ headers, headersEmitter, originalHeaders }) => {
  const [visible, setVisible] = useState(false);
  const [hoveredItem, setHoveredItem] = useState("");

  const [updatedHeaders, setUpdatedHeaders] = useState(headers);

  const onHeadersEdit = (e) => {
    const { name, value } = e.target;
    setUpdatedHeaders((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    headersEmitter('Headers', updatedHeaders);
    setVisible(false);
  };

  const handleReset = () => {
    setUpdatedHeaders(headers);
  };

  const headerElement = (
    <SeeOriginal
      data={originalHeaders}
      title="Headers"
      width="30vw"
    ></SeeOriginal>
  );

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            backgroundColor: "white",
            padding: "1rem",
            paddingLeft: "5rem",
            paddingRight: "5rem",
            width: "85vw",
            paddingTop: "2rem",
          }}
        >
          <div>
            <Image
              src="assets/Maveric_Systems_Logo.jpg"
              alt="Image"
              width="150"
              className="col-md-5"
              style={{ opacity: "0.7" }}
            />
          </div>
          <br />
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
            onMouseEnter={() => setHoveredItem(true)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div
              style={{
                width: "98%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ opacity: "0.7", fontSize: "1rem" }}>
                {headers.candidateName ? headers.candidateName : 'Candidate Name'}
              </div>
              <div
                style={{
                  opacity: "0.7",
                  fontSize: "1rem",
                  justifySelf: "end",
                  paddingRight: 16,
                }}
              >
                {headers.candidatePosition ? headers.candidatePosition : 'Candidate Position'}
              </div>
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
            setVisible(false);
          }}
        >
          <div
            style={{
              padding: "1rem",
              paddingTop: "0",
              display: "flex",
              gap: "2rem",
              marginBottom: "1rem",
            }}
          >
            <div>
              <div style={{ marginBottom: "1rem" }}>Candidate Name: </div>
              <InputText
                name="candidateName"
                value={updatedHeaders.candidateName}
                onChange={onHeadersEdit}
                placeholder="Candidate Name"
              />
            </div>
            <div>
              <div style={{ marginBottom: "1rem" }}>Candidate Position: </div>
              <InputText
                name="candidatePosition"
                value={updatedHeaders.candidatePosition}
                onChange={onHeadersEdit}
                placeholder="Candidate Position"
              />
            </div>
          </div>
          <div>
            <Button
              label="Save"
              outlined
              style={{
                width: "122px",
                borderRadius: "5px",
                borderColor: "#c2257c",
                color: "#c2257c",
                marginLeft: "1rem",
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
        </Dialog>
      </div>
    </>
  );
};

export default Header;
