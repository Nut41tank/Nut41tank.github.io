import React, { useEffect, useState } from "react";
import liff, { Liff } from "@line/liff";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [liffObject, setLiffObject] = useState<Liff>();
  const [liffError, setLiffError] = useState(null);

  // Execute liff.init() when the app is initialized
  useEffect(() => {
    console.log("start liff.init()...");
    liff
      .init({ liffId: "" })
      .then(() => {
        console.log("liff.init() done");
        setLiffObject(liff);
      })
      .catch((error) => {
        console.log(`liff.init() failed: ${error}`);
        if (!process.env.liffId) {
          console.info(
            "LIFF Starter: Please make sure that you provided `LIFF_ID` as an environmental variable."
          );
        }
        setLiffError(error.toString());
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <h1>Test line liff</h1>
      </header>
    </div>
  );
}

export default App;
