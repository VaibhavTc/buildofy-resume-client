import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import { Brain, LoaderCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";
import { AIChatSession } from "../../../../../service/AIModel";
import { toast } from "sonner";

const PROMPT = `
    Position Title: {positionTitle}
    Company Name: {companyName}

    Generate 4-5 bullet points for this work experience to add to a resume. 
    - Do NOT return JSON or arrays. 
    - Do NOT include any extra text or titles. 
    - Do NOT separate bullet points with commas. 
    - Return proper HTML only, using <ul> for the list and <li> for each bullet point. 
    - Each bullet point should be concise, achievement-focused, and action-oriented.
    - Do not add any other tags or explanations.
  `;

function RichTextEditor({
  onRichTextEditorChange,
  index,
  defaultValue,
  setExperienceList,
}) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  const GenerateSummeryFromAI = async () => {
    if (!resumeInfo?.experience[index]?.title) {
      toast.warning("Please Add Position Title");
      return;
    }
    setLoading(true);
    const prompt = PROMPT.replace(
      "{positionTitle}",
      resumeInfo.experience[index].title
    ).replace("{companyName}", resumeInfo?.experience[index].companyName);
    const result = await AIChatSession.sendMessage(prompt);
    const resp = await result.response.text();
    let htmlBulletPoints = resp;

    try {
      const parsed = JSON.parse(resp);
      if (parsed.bulletPoints) {
        htmlBulletPoints = `<ul>${parsed.bulletPoints
          .map((point) => `<li>${point}</li>`)
          .join("")}</ul>`;
      }
    } catch (err) {
      console.error("Error parsing AI response:", err);
    }

    setExperienceList((prev) => {
      const newEntries = [...prev];
      newEntries[index].workSummery = htmlBulletPoints; // save as HTML
      return newEntries;
    });
    setValue(htmlBulletPoints);
    setLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between my-2">
        <label className="text-xs">Summery</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <>
              <Brain className="h-4 w-4" /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            const html = e.target.value;
            setValue(html);
            onRichTextEditorChange({ target: { value: html } });

            setExperienceList((prev) => {
              const newEntries = [...prev];
              newEntries[index].workSummery = html;
              return newEntries;
            });
          }}
          contentEditable
          dangerouslySetInnerHTML={{ __html: value }} // Render HTML properly
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
