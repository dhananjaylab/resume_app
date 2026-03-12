import { Button } from "primereact/button";
import { useState, useRef } from "react";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import SeeOriginal from "./SeeOriginal";

const ProjectExperience = ({ projects, projectEmitter, originalProjects }) => {
  const [hoveredItem, setHoveredItem] = useState(false);
  const [hoveredEditItem, setHoveredEditItem] = useState(false);
  const [hoveredDialogItem, setHoveredDialogItem] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const projectExperienceRef = useRef(null);
  const [projectExperience, setProjectExperience] = useState(projects);
  const [selectedProject, setSelectedProject] = useState([]);
  const [selectAllProjects, setSelectAllProjects] = useState(false);
  const projectExperienceListRef = useRef(null);
  const [projectResponsibility, setProjectResponsibility] = useState([]);
  const [selectedResponsibility, setSelectedResponsibility] = useState([]);
  const [selectAllResponsibilities, setSelectAllResponsibilities] = useState(false);
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [selectedProjectDetailIndex, setSelectedProjectDetailIndex] =
    useState(null);
  const [savedProjectExperience, setSavedProjectExperience] = useState(
    projects.map((p) => ({
      ...p,
      responsibilities: [...(p.responsibilities || [])],
    }))
  );
  const [projectDetails, setProjectDetails] = useState([]);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState([]);
  const [selectAllProjectDetails, setSelectAllProjectDetails] = useState(false);
  const projectDetailsListRef = useRef(null);

  const handleEditClick = () => {
    setVisible(true);
  };

  const handleBasicDetailsEditClick = (index) => {
    setSelectedProjectDetails([]);
    setSelectAllProjectDetails(false);
    setSelectedProjectIndex(index);
    setSelectedProjectDetailIndex(index);
    setProjectDetails(
      Array.isArray(projectExperience[index]?.projectDetails)
        ? [...projectExperience[index].projectDetails]
        : []
    );
    setEditDialogVisible(true);
  };

  const handleDialogEditClick = (index) => {
    setSelectedProjectIndex(index);
    setProjectResponsibility(
      Array.isArray(projectExperience[index]?.responsibilities)
        ? [...projectExperience[index].responsibilities]
        : []
    );
    setSelectedResponsibility([]);
    setSelectAllResponsibilities(false);
    setDialogVisible(true);
  };

  const handleReset = () => {
    const reset = savedProjectExperience.map((p) => ({
      ...p,
      responsibilities: [...p.responsibilities],
    }));
    setProjectExperience(reset);
    setSelectedProject([]);
    setSelectAllProjects(false);
  };

  const handleAddNewProjects = () => {
    const newProject = {
      projectDetails: [],
      description: "",
      responsibilities: []
    };
    setProjectExperience((prev) => [...prev, newProject]);
    setTimeout(() => {
      if (projectExperienceRef.current) {
        projectExperienceRef.current.scrollTop =
          projectExperienceRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleDeleteSelectedProject = () => {
    const updatedProject = projectExperience.filter(
      (_, index) => !selectedProject[index]
    );
    setSelectedProject([]);
    setSelectAllProjects(false);
    setProjectExperience(updatedProject);
    projectEmitter('projectExperience', updatedProject);
  };

  const handleSelectAllProjects = () => {
    const newSelectAll = !selectAllProjects;
    setSelectAllProjects(newSelectAll);
    setSelectedProject(projectExperience.map(() => newSelectAll));
  };

  const toggleProjectExperience = (index) => {
    const updatedSelections = [...selectedProject];
    updatedSelections[index] = !updatedSelections[index];
    setSelectedProject(updatedSelections);

    const allSelected =
      updatedSelections.length === projectExperience.length &&
      updatedSelections.every(Boolean);
    setSelectAllProjects(allSelected);
  };

  const handleProjectDetailsReset = () => {
    const projectDetails = Array.isArray(
      projectExperience[selectedProjectIndex]?.projectDetails
    )
      ? projectExperience[selectedProjectIndex].projectDetails
      : [];
    setProjectDetails([...projectDetails]);
    setSelectedProjectDetails([]);
    setSelectAllProjectDetails(false);
  };

  const handleSave = () => {
    const updatedProjects = projectExperience
      .filter(
        (exp) => exp.description?.toString().trim() !== "" ||
          (Array.isArray(exp.projectDetails) && exp.projectDetails.length > 0) ||
          (Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0)
      )
      .map((p) => ({
        ...p,
        description: p.description?.toString().trim() || "",
        projectDetails: Array.isArray(p.projectDetails) ? [...p.projectDetails] : [],
        responsibilities: Array.isArray(p.responsibilities) ? [...p.responsibilities] : [],
      }));
    setSavedProjectExperience(updatedProjects);
    setProjectExperience(updatedProjects);
    setSelectedProject([]);
    setSelectAllProjects(false);
    projectEmitter('projectExperience', updatedProjects);
    setVisible(false);
  };

  const handleChange = (value, field, index) => {
    const updatedExperience = [...projectExperience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setProjectExperience(updatedExperience);
  };

  const handleProjectDetailsChange = (index, field, value) => {
    const updatedExperience = [...projectDetails];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    setProjectDetails(updatedExperience);
  };

  const handleSelectAllResponsibilities = () => {
    const newSelectAll = !selectAllResponsibilities;
    setSelectAllResponsibilities(newSelectAll);
    setSelectedResponsibility(projectResponsibility.map(() => newSelectAll));
  };

  const toggleCheckbox = (index) => {
    const updatedSelections = [...selectedResponsibility];
    updatedSelections[index] = !updatedSelections[index];
    setSelectedResponsibility(updatedSelections);

    const allSelected =
      updatedSelections.length === projectResponsibility.length &&
      updatedSelections.every(Boolean);
    setSelectAllResponsibilities(allSelected);
  };

  const toggleProjectDetails = (index) => {
    const updatedSelections = [...selectedProjectDetails];
    updatedSelections[index] = !updatedSelections[index];
    setSelectedProjectDetails(updatedSelections);

    const allSelected =
      updatedSelections.length === projectDetails.length &&
      updatedSelections.every(Boolean);
    setSelectAllProjectDetails(allSelected);
  };

  const handleSelectAllProjectDetails = () => {
    const newSelectAll = !selectAllProjectDetails;
    setSelectAllProjectDetails(newSelectAll);
    setSelectedProjectDetails(projectDetails.map(() => newSelectAll));
  };

  const onResponsibilityChanges = (e) => {
    const index = parseInt(e.target.name, 10);
    const updatedExperience = [...projectResponsibility];
    updatedExperience[index] = e.target.value;
    setProjectResponsibility(updatedExperience);
  };

  const handleResponsibilitiesDialogSave = () => {
    const filteredExperience = projectResponsibility?.filter(
      (exp) => exp.trim() !== ""
    );

    const updatedProjectExperience = [...projectExperience];
    updatedProjectExperience[selectedProjectIndex] = {
      ...updatedProjectExperience[selectedProjectIndex],
      responsibilities: filteredExperience,
    };
    setProjectExperience(updatedProjectExperience);
    setSelectedResponsibility([]);
    setSelectAllResponsibilities(false);
    projectEmitter('projectExperience', updatedProjectExperience);
    setDialogVisible(false);
  };

  const handleDialogReset = () => {
    const responsibilities = Array.isArray(
      projectExperience[selectedProjectIndex]?.responsibilities
    )
      ? projectExperience[selectedProjectIndex].responsibilities
      : [];
    setProjectResponsibility([...responsibilities]);
    setSelectedResponsibility([]);
    setSelectAllResponsibilities(false);
  };

  const handleAddProjectResponsibility = () => {
    setProjectResponsibility([...projectResponsibility, ""]);
    setTimeout(() => {
      if (projectExperienceListRef.current) {
        projectExperienceListRef.current.scrollTop =
          projectExperienceListRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleDeleteSelected = () => {
    const newResponsibilities = projectResponsibility.filter(
      (_, index) => !selectedResponsibility[index]
    );
    setProjectResponsibility(newResponsibilities);
    setSelectedResponsibility([]);
    setSelectAllResponsibilities(false);
  };

  const handleSaveProjectDetails = () => {
    const filteredProjectDetails = projectDetails?.filter(
      (exp) =>
        typeof exp === 'object' &&
      (exp.key?.toString().trim() !== '' || exp.value?.toString().trim() !== '')
    );
    
    const updatedProjectExperience = projectExperience.map((project, index) => {
      if (index === selectedProjectIndex) {
        return {
          ...project,
          projectDetails: filteredProjectDetails,
        };
      }
      return project;
    });

    setProjectExperience(updatedProjectExperience);
    setSelectedProjectDetails([]);
    setSelectAllProjectDetails(false);
    projectEmitter('projectExperience', updatedProjectExperience);
    setEditDialogVisible(false);
  };

  const handleAddProjectDetails = () => {
    setProjectDetails([...projectDetails, ""]);
    setTimeout(() => {
      if (projectDetailsListRef.current) {
        projectDetailsListRef.current.scrollTop =
          projectDetailsListRef.current.scrollHeight;
      }
    }, 0);
  };

  const handleDeleteSelectedProjectDetails = () => {
    const updatedProjectDetails = projectDetails.filter(
      (_, index) => !selectedProjectDetails[index]
    );

    const updatedProjectExperience = projectExperience.map((project, index) => {
      if (index === selectedProjectDetailIndex) {
        return {
          ...project,
          projectDetails: updatedProjectDetails,
        };
      }
      return project;
    });
    setSelectedProjectDetails([]);
    setSelectAllProjectDetails(false);
    setProjectDetails(updatedProjectDetails);
    setProjectExperience(updatedProjectExperience);
  };

  const capitaliseInitial = (str) =>{
    str = String(str || '');
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const headerElement = (
    <SeeOriginal
      data={originalProjects}
      title="Project Experience"
      width="85vw"
    ></SeeOriginal>
  );

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            backgroundColor: "white",
            paddingBottom: "1rem",
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
            Project Experience
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
            <div style={{ width: "98%" }}>
              <table
                className="table table-bordered"
                style={{ borderColor: "black" }}
              >
                <tbody>
                  {projectExperience?.map((exp, index) => (
                    <tr key={index}>
                      <td
                        scope="row"
                        style={{ backgroundColor: "lightGrey" }}
                        width="30%"
                      >
                        {exp.projectDetails?.map((expDetail, index) => (
                          <div key={index}>
                            <span style={{ fontWeight: "bold" }}>
                            {capitaliseInitial(expDetail.key)}:{" "}
                            </span>
                            {capitaliseInitial(expDetail.value)}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div>
                          {exp.description && (
                            <div>
                              <div style={{ fontWeight: "bold" }}>
                                Description:
                              </div>
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
                            </div>
                          )}
                          {exp.responsibilities &&
                            exp.responsibilities.length !== 0 && (
                              <div>
                                <div style={{ fontWeight: "bold" }}>
                                  Responsibilities:
                                </div>
                                <ul>
                                  {exp.responsibilities?.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  onClick={handleEditClick}
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
          style={{ width: "85vw", height: "90vh" }}
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
              justifyContent: "space-between",
              height: "99%",
            }}
          >
            <div style={{ width: "98%", height: "650px", overflowY: "auto" }}
                  ref={projectExperienceRef}>
              {projectExperience.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <Checkbox
                    checked={selectAllProjects}
                    onChange={handleSelectAllProjects}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {selectAllProjects ? "Unselect All" : "Select All"}
                </div>
              )}
              <table
                className="table table-bordered"
                style={{ borderColor: "black" }}
              >
                <tbody>
                  {projectExperience?.map((exp, index) => (
                    <tr key={index}>
                      <td
                        width="5%"
                        style={{ paddingTop: "1rem", paddingLeft: "1rem" }}
                      >
                        <Checkbox
                          style={{ marginRight: "1rem" }}
                          checked={selectedProject[index] || false}
                          onChange={() => toggleProjectExperience(index)}
                        ></Checkbox>
                      </td>
                      <td
                        scope="row"
                        style={{ backgroundColor: "lightGrey" }}
                        width="35%"
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "flex-start",
                            width: "100%",
                          }}
                          onMouseEnter={() => setHoveredEditItem(true)}
                          onMouseLeave={() => setHoveredEditItem(false)}
                        >
                          {exp.projectDetails && exp.projectDetails.length > 0 ?  
                          <div style={{ width: "98%" }}>
                            {exp.projectDetails?.map((expDetail, index) => (
                              <div key={index}>
                                <span style={{ fontWeight: "bold" }}>
                                  {capitaliseInitial(expDetail.key)}:
                                </span>{" "}
                                {capitaliseInitial(expDetail.value)}
                              </div>
                            ))}
                          </div>
                            : <div style={{ width: "98%", height: "2rem" }}></div>
                          }
                          <div
                            style={{
                              width: "2%",
                              display: "flex",
                              justifyContent: "flex-end",
                            }}
                          >
                            {hoveredEditItem && (
                              <i
                                className="pi pi-pencil"
                                onClick={() =>
                                  handleBasicDetailsEditClick(index)
                                }
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
                      </td>
                      <td>
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
                            <InputTextarea
                              key={index}
                              name={index}
                              autoResize="false"
                              value={exp.description}
                              onChange={(e) => handleChange(e.target.value, "description", index)}
                              style={{
                                resize: "none",
                                padding: 0,
                                borderRadius: 0,
                                width: "100%",
                                maxHeight: "5rem",
                                overflowY: "auto",
                              }}
                            />
                          </div>
                          <div
                            onMouseEnter={() => setHoveredDialogItem(true)}
                            onMouseLeave={() => setHoveredDialogItem(false)}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "flex-start",
                                width: "100%",
                              }}
                            >
                              <div style={{ fontWeight: "bold" }}>
                                Responsibilities:
                              </div>
                              {hoveredDialogItem && (
                                <i
                                  className="pi pi-pencil"
                                  onClick={() => handleDialogEditClick(index)}
                                  style={{
                                    fontSize: "1.05rem",
                                    color: "gray",
                                    cursor: "pointer",
                                    alignSelf: "flex-start",
                                    paddingLeft: 10,
                                  }}
                                ></i>
                              )}
                            </div>
                            <ul>
                              {exp.responsibilities?.map(
                                (skill, skillIndex) => (
                                  <li key={skillIndex}>{skill}</li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
            <div style={{ marginTop: "1rem" }}>
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
                  marginLeft: "1rem",
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
                  onClick={handleAddNewProjects}
                />
                <Button
                  disabled={!selectedProject.some(Boolean)}
                  label="Delete Selected"
                  style={{
                    width: "180px",
                    borderRadius: "5px",
                    borderColor: "#f55442",
                    background: "#f55442",
                    color: "white",
                  }}
                  onClick={handleDeleteSelectedProject}
                />
              </div>
            </div>
          </div>
        </Dialog>
        <Dialog
          header="Responsibilities"
          visible={dialogVisible}
          style={{ width: "60vw", height: "80vh" }}
          onHide={() => {
            if (!dialogVisible) return;
            handleDialogReset();
            setDialogVisible(false);
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
              ref={projectExperienceListRef}
            >
              {/* SELECT ALL CHECKBOX FOR RESPONSIBILITIES */}
              {projectResponsibility.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <Checkbox
                    checked={selectAllResponsibilities}
                    onChange={handleSelectAllResponsibilities}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {selectAllResponsibilities ? "Unselect All" : "Select All"}
                </div>
              )}
              {projectResponsibility?.map((skill, index) => (
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
                    checked={selectedResponsibility[index] || false}
                    onChange={() => toggleCheckbox(index)}
                  />
                  <InputTextarea
                    key={index}
                    rows={2}
                    cols={107}
                    name={index}
                    autoResize="false"
                    value={skill}
                    onChange={onResponsibilityChanges}
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
                  onClick={handleResponsibilitiesDialogSave}
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
                  onClick={handleDialogReset}
                />
              </div>
              <div>
                <Button
                  label="Add Responsibility"
                  outlined
                  style={{
                    width: "200px",
                    borderRadius: "5px",
                    borderColor: "#4ade80",
                    background: "#4ade80",
                    color: "white",
                    marginRight: "1rem",
                  }}
                  onClick={() => handleAddProjectResponsibility()}
                />
                <Button
                  disabled={!selectedResponsibility.some(Boolean)}
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
        <Dialog
          draggable={false}
          header="Project Details"
          visible={editDialogVisible}
          style={{ width: "60vw", height: "80vh" }}
          onHide={() => {
            if (!editDialogVisible) return;
            handleProjectDetailsReset();
            setEditDialogVisible(false);
          }}
        >
          <div
            style={{
              padding: "1rem",
              paddingTop: "0",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "99%",
            }}
          >
            <div
              style={{ width: "98%", height: "650px", overflowY: "auto" }}
              ref={projectDetailsListRef}
            >

              {projectDetails.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <Checkbox
                    checked={selectAllProjectDetails}
                    onChange={handleSelectAllProjectDetails}
                    style={{ marginRight: "0.5rem" }}
                  />
                  {selectAllProjectDetails ? "Unselect All" : "Select All"}
                </div>
              )}
              <table
                className="table table-bordered"
                style={{ borderColor: "black" }}
              >
                <tbody>
                  {projectDetails.map((exp, index) => (
                    <tr key={index}>
                      <td
                        width="5%"
                        style={{ paddingTop: "1rem", paddingLeft: "1rem" }}
                      >
                        <Checkbox
                          style={{ marginRight: "1rem" }}
                          checked={selectedProjectDetails[index] || false}
                          onChange={() => toggleProjectDetails(index)}
                        ></Checkbox>
                      </td>
                      <td
                        scope="row"
                        style={{
                          backgroundColor: "lightGrey",
                        }}
                        width="30%"
                      >
                        <span style={{ fontWeight: "bold" }}>
                          <InputText
                            style={{ width: "100%" }}
                            value={exp.key}
                            onChange={(e) =>
                              handleProjectDetailsChange(
                                index,
                                "key",
                                e.target.value
                              )
                            }
                          />
                        </span>
                      </td>
                      <td
                        style={{
                          display: "flex",
                          borderLeft: "none",
                          padding: "10px",
                        }}
                      >
                        <InputTextarea
                          key={index}
                          name={index}
                          autoResize="false"
                          value={exp.value}
                          onChange={(e) =>
                            handleProjectDetailsChange(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                          style={{
                            resize: "none",
                            padding: 0,
                            border: "none",
                            borderRadius: 0,
                            width: "100%",
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                  }}
                  onClick={handleSaveProjectDetails}
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
                  onClick={handleProjectDetailsReset}
                />
              </div>
              <div>
                <Button
                  label="Add Project Details"
                  outlined
                  style={{
                    width: "200px",
                    borderRadius: "5px",
                    borderColor: "#4ade80",
                    background: "#4ade80",
                    color: "white",
                    marginRight: "1rem",
                  }}
                  onClick={handleAddProjectDetails}
                />
                <Button
                  disabled={!selectedProjectDetails.some(Boolean)}
                  label="Delete Selected"
                  style={{
                    width: "180px",
                    borderRadius: "5px",
                    borderColor: "#f55442",
                    background: "#f55442",
                    color: "white",
                  }}
                  onClick={handleDeleteSelectedProjectDetails}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default ProjectExperience;
