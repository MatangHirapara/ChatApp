import React, { useEffect, useState } from "react";
import { user } from "../join/Join";
import socketIO from "socket.io-client";
import "./chat.css";
import Message from "../message/Message";
import ReactScrollToBottom from "react-scroll-to-bottom";
import Picker from "emoji-picker-react";
import happy from "../../images/happy.png";
import Button from "@mui/material/Button";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageViewer from "react-simple-image-viewer";
import { VisuallyHiddenInput, currTime, download } from "./customeInput";
import DownloadIcon from "@mui/icons-material/Download";
import InputEmoji from "react-input-emoji";

const ENDPOINT = "http://localhost:5500/";
let socket;

const Chat = () => {
  const [id, setId] = useState();
  const [messages, setMessages] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [file, setFile] = useState();
  const [currentImage, setCurrentImage] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [downloadImg, setDownloadImg] = useState();

  const [text, setText] = useState("");
  console.log('text', text);
  function handleOnEnter(text) {
    console.log("enter", text);
  }

  function handleChange(e) {
    if (e.target.files.length !== 0) {
      setFile(URL.createObjectURL(e.target.files[0]));
    }
  }

  const onEmojiClick = (event, emojiObject) => {
    console.log("event", event);
    let sym = event.unified.split("-");
    let codesArray = [];
    sym.map((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    console.log("emoji", emoji);
    setTextValue(textValue + emoji);
  };

  const send = () => {
    const message = textValue;
    socket.emit("message", { message, id, currTime, file });
    setEmojiOpen(false);
    setFile(null);
    setTextValue("");
  };

  useEffect(() => {
    socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("connected");
      setId(socket.id);
    });

    socket.emit("joined", { user });

    socket.on("userJoined", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("welcome", (data) => {
      setMessages([...messages, data]);
      console.log(data.user, data.message);
    });

    socket.on("leave", (data) => {
      console.log(data.user, data.message);
    });

    return () => {
      socket.emit("disConnect");
      socket.off();
    };
  }, []);

  useEffect(() => {
    socket.on("sendMessage", (data) => {
      setMessages([...messages, data]);
    });

    return () => {
      socket.off();
    };
  }, [messages]);

  const openImageViewer = (img) => {
    setDownloadImg(img);
    setCurrentImage([img, ...currentImage]);
    setIsViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <div className="header"></div>
        <ReactScrollToBottom className="chatBox">
          {messages.map((item, i) => (
            <Message
              key={i}
              user={item.id === id ? "" : item.user}
              message={item.message}
              classs={item.id === id ? "right" : "left"}
              time={item.currTime}
              img={item.file}
              openImageViewer={openImageViewer}
            />
          ))}
        </ReactScrollToBottom>
        <div className="inputBox">
          <input
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            type="text"
            id="chatInput"
            onKeyUp={(event) =>
              event.key === "Enter" && !(textValue === "") ? send() : null
            }
          />
          <Button
            component="label"
            startIcon={<AttachFileIcon />}
            onChange={handleChange}
          >
            <VisuallyHiddenInput type="file" />
          </Button>
          <img src={file} alt="" />
          <img
            src={happy}
            alt=""
            className="emojiIcon"
            onClick={() => setEmojiOpen(!emojiOpen)}
          />
          {emojiOpen && <Picker onEmojiClick={onEmojiClick} />}
          <button onClick={send} className="sendBtn">
            Send
          </button>
        </div>
        <div className="imageViewer">
          {isViewerOpen && (
            <div className="viewerPage">
              <ImageViewer
                id="image-Privew"
                src={currentImage}
                onClose={closeImageViewer}
              />
              <button
                className="downloadBtn"
                onClick={() => download(downloadImg)}
              >
                <DownloadIcon />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
