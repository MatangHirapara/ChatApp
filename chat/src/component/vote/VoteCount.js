import React, { useEffect, useState } from "react";
import socketIO from "socket.io-client";

const ENDPOINT = "http://localhost:5500/";

const VoteCount = () => {
  const [yesData, setYesData] = useState([]);
  const [yesCount, setYesCount] = useState();
  const [noData, setNoData] = useState([]);
  const [noCount, setNoCount] = useState();
  const [totalCount, setTotalCount] = useState(0);

  const handleCount = () => {
    setYesCount((yesData.length / totalCount) * 100 || "0");

    setNoCount((noData.length / totalCount) * 100 || "0");
  };

  useEffect(() => {
    handleCount();
    const socket = socketIO(ENDPOINT, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("vote", (data) => {
      console.log("socket data", data);
      setTotalCount(totalCount + 1);
      if (data.voting === "yes") {
        setYesData([{ vote: data.voting }, ...yesData]);
      } else {
        setNoData([{ vote: data.voting }, ...noData]);
      }
    });
  }, [yesData, noData]);
  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Vote Count</h2>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <div>
          <h4 style={{ borderBottom: "1px solid grey" }}>BJP Vote</h4>
          <p>Count: {yesData.length}</p>
          <p>percentage: {Number(yesCount).toFixed()}%</p>
        </div>
        <div>
          <h4 style={{ borderBottom: "1px solid grey" }}>Congress Vote</h4>
          <p>Count: {noData.length}</p>
          <p>percentage: {Number(noCount).toFixed()}%</p>
        </div>
      </div>
    </div>
  );
};

export default VoteCount;
