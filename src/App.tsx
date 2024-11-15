import React, { useEffect, useState } from "react";
import liff, { Liff } from "@line/liff";
import logo from "./logo.svg";
import "./App.css";
interface x {
  display: Liff;
}
interface LiffWithIndex extends Liff {
  [key: string]: any; // Allows accessing properties using string keys
}
const liffWithIndex: LiffWithIndex = liff;

const handleDynamicMethod = (liff: Liff, propName: string) => {
  const liffWithIndex: LiffWithIndex = liff;

  // Check if the property is a function
  if (typeof liffWithIndex[propName] === "function") {
    try {
      if (propName === "login") return;
      if (propName === "logout") return;
      // Call the function and check if the return type is a string
      const result = liffWithIndex[propName]();
      if (typeof result === "string") {
        console.log("The function returned a string:", result);
        // Do something with the string
        return result.toUpperCase(); // Example: Convert to uppercase
      } else {
        console.log("The function did not return a string.");
      }
    } catch (error) {
      console.error("Error calling the method:", error);
    }
  } else {
    console.warn(`${propName} is not a function or does not exist.`);
  }
};
function App() {
  const [liffObject, setLiffObject] = useState<Liff>();
  const [liffError, setLiffError] = useState(null);

  const MyComponent = (props: x) => {
    // You can destructure props if you have multiple
    const { display } = props;

    return (
      <div>
        {Object.getOwnPropertyNames(display).map((propName) => (
          <p>
            {propName} :{handleDynamicMethod(display, propName)}
          </p>
        ))}
      </div>
    );
  };
  // Execute liff.init() when the app is initialized
  useEffect(() => {
    console.log("start liff.init()...");
    liff
      .init({ liffId: "2006554331-dY5v7Y7Y" })
      .then(() => {
        console.log("liff.init() succeeded");
        console.log("liff", Object.keys(liff));
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
        {liffObject && (
          <div>
            <MyComponent display={liffObject}></MyComponent>
          </div>
        )}
        {liffObject?.isLoggedIn! && (
          <button
            type="button"
            onClick={() => {
              if (liffObject) liffObject.login({});
            }}
          >
            login
          </button>
        )}
      </header>
    </div>
  );
}

export default App;
