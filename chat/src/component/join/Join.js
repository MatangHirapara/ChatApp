import React, { useState } from "react";
import "./join.css";
import { Link } from "react-router-dom";

let user;
const sendUser = () => {
  user = document.getElementById("joinInput").value;
  document.getElementById("joinInput").value = ""
};

const Join = () => {
    const [name, setName] = useState("");
    
  return (
    <div className="joinPage">
      <div className="joinContainer">
        <h1>C CHAT</h1>
        <input type="text" onChange={(e) => setName(e.target.value)} id="joinInput" placeholder="Enter Your Name"/>
        <Link to='/chat' onClick={(e) => !name ? e.preventDefault() : null}>
          <button onClick={sendUser} className="joinBtn">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Join;
export { user };
