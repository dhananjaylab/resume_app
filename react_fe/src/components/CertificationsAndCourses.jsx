import { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import "primeicons/primeicons.css";
import { Checkbox } from "primereact/checkbox";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import SeeOriginal from "./SeeOriginal";

const CertificationsAndCourses = ({
  certs,
  certEmitter,
  originalCertifications,
}) => {
  const [certificates, setCertificates] = useState(certs);
  const [visible, setVisible] = useState(false);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [hoveredItem, setHoveredItem] = useState(false);
  const certsListRef = useRef(null);
  const [editableCertificates, setEditableCertificates] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSave = () => {
    const filteredCerts = editableCertificates.filter((c) => c.trim() !== "");
    setCertificates(filteredCerts);
    certEmitter('certifications', filteredCerts);
    setVisible(false);
  };

  const onCertChanges = (e) => {
    const index = parseInt(e.target.name, 10);
    const updatedCerts = [...editableCertificates];
    updatedCerts[index] = e.target.value;
    setEditableCertificates(updatedCerts);
  };

  const handleReset = () => {
    setEditableCertificates([...certificates]);
    setSelectedCerts([]);
    setSelectAll(false);
  };

  const handleAddCert = () => {
    setEditableCertificates([...editableCertificates, ""]);
    setTimeout(() => {
      if (certsListRef.current) {
        certsListRef.current.scrollTop = certsListRef.current.scrollHeight;
      }
    }, 0);
  };

    const toggleCheckbox = (index) => {
    const updatedSelections = [...selectedCerts];
    updatedSelections[index] = !updatedSelections[index];
    setSelectedCerts(updatedSelections);

    const allSelected =
      updatedSelections.length === editableCertificates.length &&
      updatedSelections.every(Boolean);
    setSelectAll(allSelected);
  };

    const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setSelectedCerts(editableCertificates.map(() => newSelectAll));
  };

  const handleDeleteSelected = () => {
    const newExperiences = editableCertificates.filter(
      (_, index) => !selectedCerts[index]
    );
    setEditableCertificates(newExperiences);
    setCertificates(newExperiences);
    setSelectedCerts([]);
    setSelectAll(false);
  };

  const headerElement = (
    <SeeOriginal
      data={originalCertifications}
      title="Certifications and Courses"
      width="30vw"
    ></SeeOriginal>
  );

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            backgroundColor: "white",
            paddingTop: "1rem",
            paddingLeft: "5rem",
            paddingRight: "5rem",
            width: "85vw",
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
            Certifications and Courses
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
              <ul>
                {certificates.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
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
                  onClick={() => {
                    setEditableCertificates([...certificates]);
                    setSelectedCerts([]);
                    setSelectAll(false);
                    setVisible(true);
                  }}
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
      </div>
      <Dialog
        draggable={false}
        header={headerElement}
        visible={visible}
        style={{ width: "60vw", height: "80vh" }}
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
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            height: "95%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              overflowY: "auto",
              marginBottom: "1rem",
            }}
            ref={certsListRef}
          >

            {editableCertificates.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  style={{ marginRight: "0.5rem" }}
                />
                {selectAll ? "Unselect All" : "Select All"}
              </div>
            )}
            {editableCertificates.map((skill, index) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
                key={index}
              >
                <Checkbox
                  style={{ marginRight: "1rem" }}
                  checked={selectedCerts[index] || false}
                  onChange={() => toggleCheckbox(index)}
                ></Checkbox>
                <InputTextarea
                  key={index}
                  rows={2}
                  cols={107}
                  name={index}
                  autoResize="false"
                  value={skill}
                  onChange={onCertChanges}
                  style={{ resize: "none" }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <Button
                label="Save"
                outlined
                style={{
                  width: "122px",
                  borderRadius: "5px",
                  borderColor: "#c2257c",
                  color: "#c2257c",
                  marginRight: "1rem",
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
                  marginRight: "1rem",
                }}
                onClick={handleReset}
              />
            </div>
            <div>
              <Button
                label="Add New"
                outlined
                style={{
                  width: "200px",
                  borderRadius: "5px",
                  borderColor: "#4ade80",
                  background: "#4ade80",
                  color: "white",
                  marginRight: "1rem",
                }}
                onClick={handleAddCert}
              />
              <Button
                disabled={!selectedCerts.some(Boolean)}
                label="Delete Selected"
                style={{
                  width: "180px",
                  borderRadius: "5px",
                  borderColor: "#f55442",
                  background: "#f55442",
                  color: "white",
                }}
                onClick={handleDeleteSelected}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default CertificationsAndCourses;