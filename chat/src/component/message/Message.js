import React from "react";
import "./message.css";


const Message = ({ user, classs, message, time, img,openImageViewer }) => {
  
  if (user) {
    return (
      <>
        <div className={`messageBox ${classs}`}>
          {`${user}: ${message}`} <img src={img} alt="" />
        </div>
        <p
          style={{
            backgroundColor: "white",
            color: "black",
            float: "left",
            fontSize: "1vmax",
          }}
        >
          {time}
        </p>
      </>
    );
  } else {
    return (
      <>
        <div className={`messageBox ${classs}`}>
            {`You: ${message}`}
            <img src={img} alt="" onClick={() =>openImageViewer(img)}/>  
        </div>
        <p
          style={{
            backgroundColor: "white",
            color: "black",
            float: "right",
            fontSize: "1vmax",
            textAlign: "left",
          }}
        >
          {time}
        </p>
      </>
    );
  }
};

export default Message;
