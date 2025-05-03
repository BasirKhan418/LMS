import { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IoCloseSharp } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Chat = ({ aiopen, setaiopen }) => {
  const [usermessage, setUserMessage] = useState("");
  const [history, setHistory] = useState([
    {
      role: "user",
      parts: [
        {
          text: `You are IL Ai, an AI assistant created by Infotact. 
                 Your role is to answer technology and coding-related questions only. 
                 If a query is beyond your expertise or violates Infotact's privacy policy, 
                 respond with: "I'm sorry, that question is beyond Infotact's privacy policy."`,
        },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState([
    {
      name: "IL-AI",
      type: "bot",
      message:
        "Hello! I'm an AI assistant created by Infotact. How can I help you today with your technology or coding questions?",
    },
  ]);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run() {
    try {
      setLoading(true);
      const chatSession = model.startChat({
        generationConfig,
        history: history,
      });
      const result = await chatSession.sendMessage(usermessage);
      setUserMessage("");
      setLoading(false);

      if (result.response.text().length > 0) {
        const botMessage = result.response.text();
        const sanitizedBotMessage =
          botMessage.trim() ||
          "I'm sorry, that question is beyond Devsomeware's privacy policy.";

        setHistory([
          ...history,
          { role: "model", parts: [{ text: sanitizedBotMessage }] },
        ]);

        const updatedChat = [
          ...chat,
          { name: "You", type: "user", message: usermessage },
          { name: "IL-AI", type: "bot", message: sanitizedBotMessage },
        ];

        setChat(updatedChat);
      } else {
        toast.error("I'm sorry, I didn't understand that. Please try again!");
      }
    } catch (err) {
      toast.error("Too many requests, please try again later!" + err);
      
    }
  }

  const handleChange = (e) => {
    setUserMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (usermessage.trim() === "") return;
    setHistory([
      ...history,
      { role: "user", parts: [{ text: `${usermessage}\n` }] },
    ]);
    setChat([...chat, { name: "You", type: "user", message: usermessage }]);
    run();
    setUserMessage("");
  };

  const chatEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Toaster position="top-center" expand={false} />
      <Sheet open={aiopen} variants="bottom">
        <SheetTitle className="hidden">menu</SheetTitle>
        <SheetContent className="w-full h-full p-0">
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-emerald-100 bg-emerald-500 text-white">
                  <AvatarImage src="/ai-logo.png" alt="IL AI" />
                  <AvatarFallback className="bg-emerald-500 text-white font-medium">IL</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">IL AI</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Online • AI Assistant
                  </div>
                </div>
              </div>
              <button 
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setaiopen(false)}
              >
                <IoCloseSharp className="text-2xl text-slate-600 dark:text-slate-300" />
              </button>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto p-4 md:p-6 space-y-6 bg-slate-50 dark:bg-slate-900">
              {chat.map((item, index) => (
                <div key={index} className="animate-fadeIn">
                  {item.type === "bot" && (
                    <div className="flex items-start gap-3 max-w-[85%]">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                        <BotIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{item.name}</span>
                        <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700">
                          <p className="whitespace-pre-wrap text-sm">
                            {item.message.replace(/\*/g, "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.type === "user" && (
                    <div className="flex items-start gap-3 ml-auto max-w-[85%] flex-row-reverse">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">{item.name}</span>
                        <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-2xl rounded-tr-none text-white shadow-sm">
                          <p className="whitespace-pre-wrap text-sm">{item.message}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {loading && (
                <div className="flex items-start gap-3 max-w-[85%] animate-pulse">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center">
                    <BotIcon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">IL-AI</span>
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 dark:border-slate-700">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        <div className="h-2 w-2 bg-slate-300 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <form onSubmit={handleSubmit} className="relative">
                <Textarea
                  placeholder="Ask me anything about technology or coding..."
                  name="message"
                  id="message"
                  onChange={handleChange}
                  value={usermessage}
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  className="min-h-[50px] max-h-[150px] rounded-full resize-none py-3 px-4 pr-12 shadow-sm border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                />
                <Button
                  type="submit"
                  disabled={!usermessage.trim()}
                  className="absolute right-2 bottom-1 top-1 my-auto w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                >
                  <ArrowUpIcon className="w-5 h-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
              <div className="text-xs text-center mt-2 text-slate-500 dark:text-slate-400">
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

function ArrowUpIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function BotIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}

function UserIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default Chat;