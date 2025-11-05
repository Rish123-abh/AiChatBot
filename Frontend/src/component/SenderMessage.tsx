import { LuCopy } from "react-icons/lu";
import { useTheme } from "../Context/useTheme";
import { toast } from "react-toastify";

type MessageProps = {
    _id:string,
    role: "user" | "ai",
    message:string,
    createdAt?:Date,
    updatedAt?:Date,
};
const SenderMessage = (props:MessageProps) => {
     const handleCopy = () => {
    navigator.clipboard.writeText(props.message);
    toast.success("Copied ", { autoClose: 1000 });
  };
    const {theme}=useTheme();
  return (
    <div className="flex justify-end my-2 relative p-auto">
      <div className={`${theme==='dark'?"bg-[#3b82f6] text-white":" bg-[#60a5fa]  text-gray-800"} font-medium  px-4 py-2 rounded-2xl max-w-[70%]`}>
        <div className="flex gap-1">
        {props.message}
        <LuCopy onClick={handleCopy} className={`w-3 h-3 cursor-pointer ${theme==="dark"?"text-white":"text-black"}  `} />
        </div>
        {props.updatedAt && (
        <div className={`text-xs ${theme==='dark'?"text-white ":"text-black"}  font-semibold mt-1 text-right`}>
          {new Date(props.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      
      </div>
    </div>
  );
};

export default SenderMessage;
