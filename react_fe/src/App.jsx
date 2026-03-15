import { useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Toast } from "primereact/toast";
import { Image } from "primereact/image";
import { Button } from "primereact/button";
import ResumeEditor from "./components/ResumeEditor";
import "./App.css";
import FullPageSpinner from "./components/FullPageSpinner";
import MiscellaneousData from "./components/MiscellaneousData";
import { FaUpload, FaTimes, FaRegFileAlt, FaRegListAlt } from "react-icons/fa";


const getDefaultSchema = () => ({
  Headers: {},
  professionalSummary: "",
  professionalExperience: [],
  awards: [],
  certifications: [],
  education: [],
  credits: [],
  projectExperience: [],
  miscellaneous: [],
});


const mapParsedResume = (data) => ({
  Headers: data.Headers || data.headers || {},
  professionalSummary: data.professionalSummary || data.professional_summary || "",
  professionalExperience: data.professionalExperience || data.work_experience || [],
  awards: data.awards || [],
  certifications: data.certifications || [],
  education: data.education || [],
  credits: data.credits || [],
  projectExperience: data.projectExperience || data.projects || [],
  miscellaneous: data.miscellaneous || [],
});

function App() {
  const toast = useRef(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [schemaStructured, setSchemaStructured] = useState(getDefaultSchema);
  const [rawStructured, setRawStructured] = useState(getDefaultSchema);
  const [dragActive, setDragActive] = useState(false);
  const [hover, setHover] = useState(false);

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 5 * 1024 * 1024;

  const onFileSelect = async (event) => {
    const file = event.files[0];
    if (!allowedTypes.includes(file.type)) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid file type. Please upload a PDF or Word document.",
      });
      return;
    }

    if (file.size > maxSize) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "File size exceeds 5 MB.",
      });
      return;
    }

    setLoading(true);
    setLoadingMessage("Uploading your file...");
    setSchemaStructured(null);

    const formData = new FormData();
    formData.append("file", file);

    Promise.allSettled([
      fetch(`${import.meta.env.VITE_API_URL}resume/parse`, {
        method: "POST",
        body: formData,
      }),
      fetch(`${import.meta.env.VITE_API_URL}resume/parse-raw-resume`, {
        method: "POST",
        body: formData,
      }),
    ])
      .then(async ([res1, res2]) => {
        setLoadingMessage("Extracting resume data...");
        let data = null;
        if (res1.status === "fulfilled") {
          const response1 = res1.value;
          data = await response1.json();

          if (!response1.ok) {
            throw new Error(data.message || "Error in parse API");
          }


          setFile(file);
          toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Extracted data from " + file.name + ".\n Please wait...",
          });

          const parsed = mapParsedResume(data);
          parsed.miscellaneous = [
            ...(parsed.miscellaneous || [])
          ];
          setSchemaStructured(parsed);
        } else {
          console.error("Parse API failed:", res1.reason);
        }

        let rawData = null;
        if (res2.status === "fulfilled") {
          const response2 = res2.value;
          rawData = await response2.json();

          if (!response2.ok) {
            throw new Error(rawData.message || "Error in parse-raw-resume API");
          }
          setRawStructured(mapParsedResume(rawData))
        } else {
          console.error("Raw Resume API failed:", res2.reason);
        }
      })
      .catch((error) => {
        setLoadingMessage("Error while extracting resume data.");
        setLoading(false);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false);
          setLoadingMessage("");
        }, 1000);
      });
  };

  const handleRemoveFile = () => {
    setFile(null);
    setSchemaStructured(null);
    setRawStructured(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect({ files: [e.dataTransfer.files[0]] });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect({ files: [e.target.files[0]] });
    }
  };

  return (
    <>
      {loading && <FullPageSpinner message={loadingMessage} />}
      <Toast ref={toast}></Toast>
      <nav style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem 2rem",
          minHeight: 100,
          background: "#fff"
        }}>
          <div>
            <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1a4879" }}>Resume </span>
            <span style={{ fontSize: "2.5rem", fontWeight: 700, color: "#c2257c" }}>Standardizer</span>
          </div>
          <div style={{ fontSize: "1.2rem", color: "#64748b", fontWeight: 500, marginTop: "0.5rem" }}>
            AI-powered content extraction and processing
          </div>
        </nav>
      <br />
      <div style={{ margin: "0 2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <div className="card p-4" style={{ borderRadius: "16px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            </h2>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("resume-upload-input").click()}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{
                border: dragActive ? "2px solid #3b82f6" : hover ? "2px solid #2563eb" : "2px dashed #cbd5e1",
                borderRadius: 16,
                minHeight: 250,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: dragActive ? "#f0f6ff" : "#fff",
                position: "relative",
                transition: "border 0.2s, background 0.2s",
                marginBottom: 16,
                cursor: "pointer",
              }}
            >
              {!file ? (
                <>
                  <FaUpload style={{ fontSize: 48, color: "#94a3b8", marginBottom: 16 }} />
                  <div style={{ fontSize: 24, fontWeight: 500, marginBottom: 8 }}>
                    Drag and drop your resume file here
                  </div>
                  <div style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
                    or click to <span style={{ color: "#2563eb", textDecoration: "underline", cursor: "pointer" }}>browse</span> from your computer
                  </div>
                  <label htmlFor="resume-upload-input">
                    <input
                      id="resume-upload-input"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                  <div style={{ color: "#64748b", marginTop: 16, fontSize: 15 }}>
                    Supported formats: PDF, DOC, DOCX, PPT, PPTX • Maximum file size: 5MB
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                  <div style={{ position: "absolute", top: 16, right: 16, cursor: "pointer" }} onClick={handleRemoveFile}>
                    <FaTimes style={{ fontSize: 24, color: "#ef4444" }} title="Remove file" />
                  </div>
                  <FaUpload style={{ fontSize: 48, color: "#94a3b8", marginBottom: 16 }} />
                  <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 8 }}>{file.name}</div>
                  <div style={{ color: "#64748b", marginBottom: 8 }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                  <div style={{ color: "#22c55e", fontWeight: 500 }}>Uploaded successfully</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {file && schemaStructured && (
          <>
            <div className="card p-4" style={{ borderRadius: "16px", boxShadow: "0 4px 24px rgba(99, 102, 241, 0.08)", background: "#fff", marginBottom: 24 }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
                <FaRegFileAlt style={{ fontSize: 24, color: "#6366f1" }} /> Preview Resume
              </h2>
              <div style={{ border: "2px dashed #cbd5e1", borderRadius: 16, minHeight: 180, padding: 24, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ResumeEditor data={schemaStructured} rawData={rawStructured} />
              </div>
            </div>
            <div className="card p-4" style={{ borderRadius: "16px", boxShadow: "0 4px 24px rgba(99, 102, 241, 0.08)", background: "#fff", marginBottom: 24 }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
                <FaRegListAlt style={{ fontSize: 24, color: "#6366f1" }} /> Miscellaneous Data
              </h2>
              <div style={{ border: "2px dashed #cbd5e1", borderRadius: 16, minHeight: 120, padding: 24, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MiscellaneousData data={schemaStructured} />
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
