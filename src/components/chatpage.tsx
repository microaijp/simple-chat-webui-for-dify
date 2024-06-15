"use client";

import { useEffect, useState, useRef } from 'react';
import Navbar from "@/components/navbar";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { v4 as uuidv4 } from 'uuid';
import useAutosizeTextArea from '@/libs/useAutosizeTextArea';


export default function ChatPage() {

  const [user, setUser] = useState(uuidv4());

  const [conversationId, setConversationId] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [message, setMessage] = useState("");

  const [chatItemList, setChatItemList] = useState([]);

  const chatListRef = useRef(null);
  const chatRef = useRef(null);

  let mobileChatFocusTimer = null;


  useAutosizeTextArea(chatRef.current, message);
  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;
    setMessage(val);
  };

  function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  async function getApplicationInformation() {

    const url = '/api/dify/parameters';
    const response = await fetch(url, { method: 'GET' });
    const application_information = await response.json();
    return application_information;

  }

  const addChatItem = (newChatItem) => {
    setChatItemList((prevChatItemList) => [...prevChatItemList, newChatItem]);
  };

  const updateLastChatItemMessage = (chunk) => {
    setChatItemList((prevChatItemList) => {
      const newChatItemList = [...prevChatItemList];
      newChatItemList[newChatItemList.length - 1]["spinner"] = false;
      newChatItemList[newChatItemList.length - 1]["message"] += chunk;
      return newChatItemList;
    });
  };


  const handleFocusIn = () => {
    if (isMobileDevice()) {
      mobileChatFocusTimer = setInterval(function () {
        scrollToBottom();
      }, 100);
    }
  };

  const handleFocusOut = () => {
    if (mobileChatFocusTimer != null) {
      clearInterval(mobileChatFocusTimer);
    }
  };


  const scrollToBottom = () => {

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      // behavior: 'smooth'
    });
  };


  useEffect(() => {


    chatRef.current.addEventListener('focusin', handleFocusIn);
    chatRef.current.addEventListener('focusout', handleFocusOut);

    const fetchApplicationInformation = async () => {
      const application_information = await getApplicationInformation();
      console.log('application_information', application_information);

      const opening_statement = application_information["opening_statement"] || '';
      const suggested_questions = application_information["suggested_questions"] || [];

      if (opening_statement != '') {
        addChatItem({
          'type': 'assistant',
          'spinner': false,
          'message': opening_statement,
          'suggested_questions': suggested_questions
        })
      }
    };
    fetchApplicationInformation();

  }, []);

  const sendMessage = async (directMessage = null) => {

    if ((message || directMessage) && waiting == false) {

      const chat_message = {
        'inputs': {},
        'user': user,
        'response_mode': 'streaming',
        'query': directMessage || message,
        'conversation_id': conversationId
      };


      // from user
      addChatItem({
        'type': 'user',
        'message': directMessage || message,
      })
      // for assistant
      addChatItem({
        'type': 'assistant',
        'spinner': true,
        'message': ''
      })

      setMessage("");

      if (!isMobileDevice()) {
        chatRef.current.focus();
      }

      setTimeout(() => {
        chatListRef.current.scrollTo({
          top: chatListRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);



      setWaiting(true);

      const response = await fetch('/api/dify/chat-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(chat_message)
      });

      const reader = response.body?.getReader();
      if (!reader) return;

      let decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        buffer += decoder.decode(value, { stream: true });

        let lines = buffer.split('\n');
        buffer = lines.pop();

        for (let line of lines) {
          if (line.startsWith('data: ')) {
            try {
              let event_data = line.slice(6).trim();
              event_data = JSON.parse(event_data);
              // console.log('[SSE]', 'event_data', event_data);

              switch (event_data["event"]) {
                case 'message':
                  updateLastChatItemMessage(event_data["answer"]);
                  break;
                case 'workflow_started':
                  setConversationId(event_data["conversation_id"]);
                  break;
                case 'node_started':
                  break;
                case 'node_finished':
                  break;
                case 'workflow_finished':
                  setWaiting(false);
                  break;
                case 'message_end':
                  break;
              }
            } catch (e) {
              console.log('[SSE ERROR]', 'line', line, e);
            }
          }
        }
      }

    }
  };





  return (
    <>

      <div className="">

        <Navbar></Navbar>
        <div className="chat-container">
          <div className="w-full h-full flex flex-col bg-white chat-main">
            <div
              ref={chatListRef}
              className="p-4 flex-grow overflow-y-auto chat-list"
            >
              <ul
                id="chat_box"
              >

                {chatItemList && chatItemList.map((chatItem, chatItemIndex) => (
                  <>
                    {chatItem.type == "user" ? (
                      <>
                        <li className="mt-4">
                          <div className="flex items-start gap-2.5" dir="rtl">
                            <img className="w-8 h-8 rounded-full" src={process.env.NEXT_PUBLIC_USER_ICON_URL} alt="user" />
                            <div
                              className="flex flex-col w-full max-w-[620px] leading-1.5 p-4 rounded-e-xl rounded-es-xl"
                              style={{ "backgroundColor": process.env.NEXT_PUBLIC_USER_CHAT_BACKGROUND_COLOR }}

                            >
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900">
                                  {process.env.NEXT_PUBLIC_USER_NAME}
                                </span>
                              </div>
                              <p className="whitespace-pre-wrap text-sm font-normal py-2.5 text-gray-900" dir="ltr">
                                {chatItem.message}
                              </p>
                            </div>
                          </div>
                        </li>

                      </>
                    ) : (
                      <>
                        <li className="mt-4 chat_item">
                          <div className="flex items-start gap-2.5">
                            <img className="w-8 h-8 rounded-full" src={process.env.NEXT_PUBLIC_ROBOT_ICON_URL} alt={process.env.NEXT_PUBLIC_ROBOT_NAME} />
                            <div
                              className="flex flex-col w-full max-w-[620px] leading-1.5 p-4 rounded-e-xl rounded-es-xl"
                              style={{ "backgroundColor": process.env.NEXT_PUBLIC_ROBOT_CHAT_BACKGROUND_COLOR }}
                            >
                              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="text-sm font-semibold text-gray-900">
                                  {process.env.NEXT_PUBLIC_ROBOT_NAME}
                                </span>
                              </div>

                              {chatItem.spinner &&
                                <>
                                  <div className="text-center">

                                    <div role="status">
                                      <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin  fill-gray-600 " viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                      </svg>
                                      <span className="sr-only">Loading...</span>
                                    </div>


                                  </div>
                                </>
                              }



                              <p className="assistant_chat_message text-sm font-normal py-2.5 text-gray-900">
                                <ReactMarkdown
                                  rehypePlugins={[]}
                                  remarkPlugins={[
                                    remarkGfm
                                  ]}
                                  components={{
                                    a({ node, children, ...props }) {
                                      try {
                                        new URL(props.href ?? "");
                                        props.target = "_blank";
                                        props.rel = "noopener noreferrer";
                                      } catch (e) { }

                                      return <a {...props}>{children}</a>;
                                    },
                                  }}

                                >
                                  {chatItem.message}
                                </ReactMarkdown>
                              </p>

                              {chatItem.suggested_questions && chatItem.suggested_questions.length > 0 &&
                                <>

                                  <ul className='flex flex-wrap gap-2 mt-4'>
                                    {chatItem.suggested_questions.map((suggested_question, suggested_questions_index) => (
                                      <>
                                        <button
                                          type="button"
                                          className="text-blue-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 inline-block w-fit"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            sendMessage(suggested_question);
                                          }}
                                        >{suggested_question}</button>
                                      </>
                                    ))}
                                  </ul>


                                </>
                              }
                            </div>
                          </div>
                        </li>
                      </>
                    )}
                  </>
                ))}


              </ul>
            </div>
            <div className="p-4 border-t flex items-center bg-white">
              <textarea
                id="chat"
                ref={chatRef}
                rows={1}
                className="auto_height block mr-2 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder={process.env.NEXT_PUBLIC_CHAT_PLACEHODLER}
                value={message}
                onChange={handleChange}
              />

              <button
                id="btn_chat"
                type="button"
                className="inline-flex justify-center items-center p-4 rounded-full cursor-pointer h-full"
                onClick={() => sendMessage()}
                disabled={waiting}
              >
                <img
                  src='/send_icon.svg'
                >

                </img>
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
