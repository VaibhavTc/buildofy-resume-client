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

const PROMPT =
  "Don't give result in JSON format, don't give any commas to separate bullet points. position title: {positionTitle},company name:{companyName} , depending on position title give me 4-5 bullet points for my experience to add in resume please do not include any kind of title and provide me HTML only with proper tags for bullet points not direct bullet points. Give me tags only not json format and don't give me an array I want separate bullets points also don't use commas to separate bullet points.";

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
    const resp = await result.response.text(); // Wait for text response
    setValue(resp.replace('"', '"'));

    // Update the experience list directly
    setExperienceList((prev) => {
      const newEntries = [...prev];
      newEntries[index].workSummery = resp.replace('"', '"');
      return newEntries;
    });

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
            setValue(e.target.value);
            onRichTextEditorChange({ target: { value: e.target.value } });

            // Also update the experience list directly
            setExperienceList((prev) => {
              const newEntries = [...prev];
              newEntries[index].workSummery = e.target.value;
              return newEntries;
            });
          }}
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
