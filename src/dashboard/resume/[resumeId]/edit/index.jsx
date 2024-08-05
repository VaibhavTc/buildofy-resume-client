import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import ResumePreview from "../../components/ResumePreview";
import FormSections from "../../components/FormSections";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import { useState } from "react";
import GlobalApi from "../../../../../service/GlobalApi";
function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState({});
  useEffect(() => {
    GetResumeInfo();
  }, []);
  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId).then((res) => {
      console.log(res.data.data);
      setResumeInfo(res.data.data);
    });
  };
  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSections />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
