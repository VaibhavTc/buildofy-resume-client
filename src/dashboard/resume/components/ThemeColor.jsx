import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import GlobalApi from "./../../../../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ThemeColor() {
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#A133FF",
    "#33FFA1",
    "#FF7133",
    "#71FF33",
    "#7133FF",
    "#FF3371",
    "#33FF71",
    "#3371FF",
    "#A1FF33",
    "#33A1FF",
    "#FF6739",
    "#5733FF",
    "#33FF5A",
    "#5A33FF",
    "#FF335A",
    "#335AFF",
  ];
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [selectedColor, setSelectedColor] = useState();
  const [isSet, setIsSet] = useState(false);
  const { resumeId } = useParams();
  const onColorSelect = (color) => {
    setSelectedColor(color);
    setIsSet(true);
    setResumeInfo({
      ...resumeInfo,
      themeColor: color,
    });
    const data = {
      data: {
        themeColor: color,
      },
    };
    GlobalApi.UpdateResumeDetail(resumeId, data).then(async (resp) => {
      await toast.success("Theme Color Updated");
      setIsSet(false);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2">
          {" "}
          <LayoutGrid /> Theme
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h2 className="mb-2 text-sm font-bold">Select Theme Color</h2>
        {!isSet ? (
          <div className="grid grid-cols-5 gap-3">
            {colors.map((item, index) => (
              <div
                onClick={() => onColorSelect(item)}
                className={`h-5 w-5 rounded-full cursor-pointer
             hover:border-black border p-4
             ${selectedColor == item && "border border-black p-3"}
             `}
                style={{
                  background: item,
                }}
              ></div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <Loader2 className="h-5 w-5 animate-spin h-32" />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default ThemeColor;
