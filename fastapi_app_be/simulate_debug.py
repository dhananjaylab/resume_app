import io
import os
import sys
import asyncio
from pathlib import Path

# Setup path
sys.path.append(os.getcwd())

from services.docx_service import download_resume
from models.resume import ResumeData, Headers, ProjectExperience, ProjectDetail

async def simulate_and_inspect():
    # Mock data
    resume_data = ResumeData(
        headers=Headers(candidateName="Dhananjay Lokhande", candidatePosition="Software Engineer"),
        professionalSummary="Summary with special char \x0c and \t and \n",
        professionalExperience=["Exp 1", "Exp 2"],
        awards=["Award 1"],
        certifications=[],
        education=[],
        credits=[],
        projectExperience=[
            ProjectExperience(
                description="Test Project",
                projectDetails=[ProjectDetail(key="Tech", value="Python")],
                responsibilities=["Task 1"]
            )
        ]
    )
    
    # Generate
    template_path = "templates/Maveric_Template.docx"
    doc_bytes, filename = await download_resume(resume_data, template_path)
    
    # Save to disk for inspection
    output_path = "debug_output.docx"
    with open(output_path, "wb") as f:
        f.write(doc_bytes)
    
    print(f"Saved generated DOCX to {output_path}")
    
    # Now expand the generated archive
    import shutil
    debug_dir = "debug_extracted"
    if os.path.exists(debug_dir):
        shutil.rmtree(debug_dir)
    
    # Copy to zip and extract
    shutil.copy(output_path, "debug_output.zip")
    
    # Use powershell to extract
    import subprocess
    subprocess.run(["powershell", "-Command", f"Expand-Archive -Path 'debug_output.zip' -DestinationPath '{debug_dir}' -Force"])
    
    print(f"Extracted to {debug_dir}")
    
    # Check if header1.xml.rels exists and has rId1
    rels_path = os.path.join(debug_dir, "word", "_rels", "header1.xml.rels")
    if os.path.exists(rels_path):
        with open(rels_path, "r") as f:
            content = f.read()
            print("header1.xml.rels content check:")
            print(f"Contains rId1: {'rId1' in content}")
    else:
        print("header1.xml.rels MISSING!")

    # Check footer rels too
    word_rels = os.path.join(debug_dir, "word", "_rels")
    print(f"Files in word/_rels: {os.listdir(word_rels)}")

if __name__ == "__main__":
    asyncio.run(simulate_and_inspect())
