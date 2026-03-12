import React, { useRef, useEffect } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

const SeeOriginal = ({ data, title, width }) => {
  const op = useRef(null);
  const buttonRef = useRef(null);

  const UnorderedList = data ? (
    <ul>
      {(Array.isArray(data) ? data : []).map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  ) : (
    <div>Data not found</div>
  );

  const HeaderDiv = data ? (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div>
        <div style={{ fontWeight: "bold" }}>Candidate Name:</div>
        <div>{data?.candidateName}</div>
      </div>
      <div>
        <div style={{ fontWeight: "bold" }}>Candidate Position:</div>
        <div>{data?.candidatePosition}</div>
      </div>
    </div>
  ) : (
    <div>Data not found</div>
  );

  const CreditsTable = data ? (
    <table className="table table-bordered" style={{ borderColor: "black" }}>
      <tbody>
        {(Array.isArray(data) ? data : []).map((credit, index) => (
          <tr key={index}>
            <td scope="row" style={{ backgroundColor: "#ebeae8" }} width="30%">
              <div>
                <div>
                  <span style={{ fontWeight: "bold" }}>{credit.category}</span>
                </div>
              </div>
            </td>
            <td style={{ backgroundColor: "#ebeae8" }}>
              <div>{credit.items?.join(", ")}</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div>Data not found</div>
  );

  const ProjectsExperience =
    data && data.length > 0 ? (
      <div style={{ overflowY: "auto" }}>
        <table
          className="table table-bordered"
          style={{ borderColor: "black", fontSize: "13px" }}
        >
          <tbody>
            {(Array.isArray(data) ? data : []).map((exp, index) => (
              <tr key={index}>
                <td scope="row" style={{ backgroundColor: "#ebeae8" }}>

                  {exp.projectDetails?.map((expDetail, index) => (
                    <div key={index}>
                      <span style={{ fontWeight: "bold" }}>
                        {expDetail.key}:{" "}
                      </span>
                      {expDetail.value}
                    </div>
                  ))}
                </td>
                <td style={{ backgroundColor: "#ebeae8" }}>
                  <div>
                    <div style={{ fontWeight: "bold" }}>Description:</div>
                    <div
                      style={{
                        marginBottom: "1rem",
                        paddingLeft: "1rem",
                        paddingRight: "1rem",
                        textAlign: "justify",
                      }}
                    >
                      {exp.description}
                    </div>
                    <div style={{ fontWeight: "bold" }}>Responsibilities:</div>
                    <ul>
                      {exp.responsibilities?.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div>Data not found</div>
    );

  const onShow = () => {
    document.body.style.overflow = "hidden";
  };

  const onHide = () => {
    document.body.style.overflow = "auto";
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "c") {
        op.current?.hide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{title}</span>
        <Button
          label="See Original"
          outlined
          style={{
            width: "70px",
            padding: "1px",
            borderRadius: "5px",
            borderColor: "#c2257c",
            color: "#c2257c",
            fontSize: "10px",
          }}
          onClick={(e) => op.current.toggle(e)}
          ref={buttonRef}
        ></Button>
        <OverlayPanel
          ref={op}
          style={{
            width: data ? width : "20rem",
            backgroundColor: "#ebeae8",
            maxHeight: "500px",
            overflowY: "auto",
          }}
          onShow={onShow}
          onHide={onHide}
        >
          {(() => {
            switch (title) {
              case "Headers":
                return HeaderDiv;
              case "Professional Summary":
                return <div>{data ? data : "Data not found"}</div>;
              case "Awards & Recognitions":
                return UnorderedList;
              case "Certifications and Courses":
                return UnorderedList;
              case "Professional Experience":
                return UnorderedList;
              case "Educational Qualification":
                return UnorderedList;
              case "Credits":
                return CreditsTable;
              case "Project Experience":
                return ProjectsExperience;
              default:
                return <div>{JSON.stringify(data)}</div>;
            }
          })()}
        </OverlayPanel>
      </div>
    </>
  );
};

export default SeeOriginal;