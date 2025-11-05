import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTheme } from "../Context/useTheme";
import { LuCopy } from "react-icons/lu";
import { toast } from "react-toastify";
type MessageProps = {
    _id:string,
    role: "user" | "ai",
    message:string,
    createdAt?:Date,
    updatedAt?:Date,
};
const ReceiverMessage = (props:MessageProps) => {
       const handleCopy = () => {
        navigator.clipboard.writeText(props.message);
        toast.success("Copied ", { autoClose: 1000 });
      };
    const {theme}=useTheme();
  return (
    <div className="flex justify-start my-2 ">
      <div className={`${theme==='dark'?" bg-gray-700 text-white":"bg-gray-300 text-black"} relative font-medium  px-4 py-2 rounded-2xl max-w-[70%] shadow text-left`}>
        <div className="">
        <ReactMarkdown remarkPlugins={[remarkGfm]} >
        {props.message}
      </ReactMarkdown>
        <LuCopy onClick={handleCopy} className={`w-3 h-3 cursor-pointer absolute top-2 right-2 ${theme==="dark"?"text-white":"text-black"}  `} />
        </div>
      {props.updatedAt && (
        <div className={`text-xs ${theme==='dark'?"text-white":"text-black"}  font-semibold mt-1 text-right`}>
          {new Date(props.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
      </div>
    </div>
  );
};

export default ReceiverMessage;
