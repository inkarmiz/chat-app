import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import moment from "moment";
import { useEffect, useRef } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";

const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
  } = useAppStore();

  // Show all messages
  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(
          GET_ALL_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
    }
  }, [selectedChatType, selectedChatData, setSelectedChatMessages]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|webp|svg|tiff|avif?)$/i;
    return imageRegex.test(filePath);
  };

  /**
   * Downloads a file from the server and triggers a browser download.
   *
   * This function sends a GET request to retrieve the file as a Blob,
   * creates a temporary object URL, and programmatically clicks a hidden
   * anchor element to start the download. It then cleans up the temporary
   * link and revokes the object URL to free resources.
   *
   * @async
   * @function downloadFile
   * @param {string} fileUrl - The relative or absolute URL of the file to download.
   * @returns {Promise<void>} Resolves when the download has been triggered.
   */
  const downloadFile = async (fileUrl) => {
    const response = await apiClient.get(`${HOST}/${fileUrl}`, {
      responseType: "blob",
    });
    // Converts the binary data into a temporary URL that the browser can use to reference the file in memory.
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    // Creates a hidden <a> (anchor) element dynamically.
    const link = document.createElement("a");
    // Sets its href to the blob URL.
    link.href = urlBlob;
    // Adds a download attribute, which tells the browser to download the file instead of navigating to it.
    // The filename is extracted from the URL
    link.setAttribute("download", fileUrl.split("/").pop());
    // Appends the link to the document so it exists in the DOM.
    document.body.appendChild(link);
    // Simulates a click on the link — this triggers the download automatically.
    link.click();
    // Removes the link afterward to clean up the DOM.
    link.remove();
    // Revokes the object URL to free up browser memory.
    window.URL.revokeObjectURL(urlBlob);
  };

  // Function to render messages with date separators
  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY_MM_DD");
      // Show date separator if the date changes
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (
            <div className="text-center text-gray-500 my-5">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
        </div>
      );
    });
  };

  // Function to render direct message
  const renderDMMessages = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`} // Align message based on sender, i.e. left for received, right for sent
    >
      {/* Check if it is a text message */}
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
              : "bg-[#2a2b33]/5 text-white/80 border-white/20"
          } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
        >
          {message.content}
        </div> // Color and alignment based on sender. i.e. different styles for sent and received messages
      )}

      {/* Check if it is a file*/}
      {
        message.messageType === "file" && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-white/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div className="cursor-pointer">
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/8 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        ) // Color and alignment based on sender. i.e. different styles for sent and received messages
      }
      <div className="text-xs text-gray-600">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  );
};

export default MessageContainer;
