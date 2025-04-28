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
      console.error(err);
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
        <SheetTitle className="hidden">
menu
        </SheetTitle>
        <SheetContent className="w-full h-full">
          <div
            className="absolute right-[13px] top-[10px] cursor-pointer"
            onClick={() => {
              setaiopen(!aiopen);
            }}
          >
            <IoCloseSharp className="text-2xl" />
          </div>
          <div className="flex flex-col h-full w-full bg-background">
            <header className="flex items-center gap-4 px-6 py-4 border-b bg-card">
              <Avatar className="w-10 h-10 border">
                <AvatarFallback>IL</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">IL AI</div>
                <div className="text-sm text-muted-foreground">
                  AI Assistant
                </div>
              </div>
            </header>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              {chat.map((item, index) => (
                <div key={index}>
                  {item.type === "bot" && (
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg w-11 h-11 bg-[#55efc4] text-3xl flex items-center justify-center px-4">
                        <BotIcon className="w-6 h-6" />
                      </div>
                      <div className="grid gap-1 items-start text-sm">
                        <div className="font-medium">{item.name}</div>
                        <div className="bg-card p-3 rounded-lg max-w-[100%] text-card-foreground">
                          <p className="overflow-hidden">
                            {item.message.replace(/\*/g, "")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.type === "user" && (
                    <div className="flex items-start gap-4 justify-end">
                      <div className="grid gap-1 items-end text-sm">
                        <div className="font-medium">{item.name}</div>
                        <div className="bg-primary p-3 rounded-lg text-primary-foreground break-words">
                          <p className="w-52 h-auto overflow-hidden">
                            {item.message}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg w-11 h-11 bg-[#fdcb6e] text-3xl flex items-center justify-center px-4">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="w-full max-w-md mx-auto animate-pulse p-9">
                  <h1 className="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600"></h1>
                  <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                  <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                  <p className="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                  <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="bg-card p-4 border-t">
              <div className="relative">
                <Textarea
                  placeholder="Type your message..."
                  name="message"
                  id="message"
                  onChange={handleChange}
                  value={usermessage}
                  rows={1}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute w-8 h-8 top-3 right-3"
                  onClick={handleSubmit}
                >
                  <ArrowUpIcon className="w-4 h-4" />
                  <span className="sr-only">Send</span>
                </Button>
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
