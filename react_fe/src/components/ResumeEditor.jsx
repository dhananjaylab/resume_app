import { useState, useRef } from "react";
import { Button } from "primereact/button";
import Header from "./Header";
import { Toast } from "primereact/toast";
import ProfessionalSummary from "./ProfessionalSummary";
import ProfessionalExperience from "./ProfessionalExperience";
import CertificationsAndCourses from "./CertificationsAndCourses";
import EducationAndQualifications from "./EducationAndQualifications";
import Credits from "./Credits";
import Awards from "./Awards";
import ProjectExperience from "./ProjectExperience";
import FullPageSpinner from "./FullPageSpinner";
import { generateAndDownloadResume } from "../services/docxGenerator";

const ResumeEditor = ({ data, rawData }) => {
  const [schemaStructured, setSchemaStructured] = useState(data);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const downloadResume = async () => {
    setLoading(true);
    try {
      console.log("[ResumeEditor] Generating resume on frontend...");
      await generateAndDownloadResume(schemaStructured);
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Resume downloaded successfully!",
      });
    } catch (error) {
      console.error("Frontend download error:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to generate resume on frontend.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section, value) => {
    setSchemaStructured(prev => ({
      ...prev,
      [section]: value
    }));
  };

  return (
    <>
      {loading && <FullPageSpinner />}
      <Toast ref={toast}></Toast>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "black",
        }}
      >
        <Header
          headers={schemaStructured.Headers}
          originalHeaders={rawData?.headers}
          headersEmitter={handleSectionChange}
        />
        <ProfessionalSummary
          summary={schemaStructured.professionalSummary}
          originalSummary={rawData?.professionalSummary}
          summaryEmitter={handleSectionChange}
        />
        <ProfessionalExperience
          experience={schemaStructured.professionalExperience}
          originalExperience={rawData?.professionalExperience}
          experienceEmitter={handleSectionChange}
        />
        <Awards
          awards={schemaStructured.awards}
          originalAwards={rawData?.awards}
          awardsEmitter={handleSectionChange}
        />
        <CertificationsAndCourses
          certs={schemaStructured.certifications}
          originalCertifications={rawData?.certifications}
          certEmitter={handleSectionChange}
        />
        <EducationAndQualifications
          eduList={schemaStructured.education}
          originalEduList={rawData?.education}
          eduListEmitter={handleSectionChange}
        />
        <Credits
          creditMap={schemaStructured.credits}
          originalCredits={rawData?.credits}
          creditEmitter={handleSectionChange}
        />
        <ProjectExperience
          projects={schemaStructured.projectExperience}
          originalProjects={rawData?.projectExperience}
          projectEmitter={handleSectionChange}
        />
        <Button
          onClick={downloadResume}
          label="Download Resume"
          outlined
          style={{
            marginTop: "1rem",
            width: "200px",
            height: "50px",
            marginLeft: "1rem",
            borderRadius: "5px",
            borderColor: "#1a4879",
            color: "#1a4879",
          }}
        />
      </div>
    </>
  );
};

export default ResumeEditor;
