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
interface JWT {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  auth_time?: number;
  nonce?: string;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
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
      if (propName === "getProfile") {
        let x = "";
        liffWithIndex[propName]().then((profile) => {
          console.log("The function returned a profile:", profile);
          // Do something with the profile
          x = JSON.stringify({
            "profile.userId": profile.userId,
            "profile.statusMessage": profile.statusMessage,
            "profile.displayName": profile.displayName,
            "profile.pictureUrl": profile.pictureUrl,
          }); // Example: Get user ID
        });
        return x;
      }
      if (propName === "getProfilePlus")
        return liffWithIndex[propName]()?.regionCode;
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
function parseJwt(token: string) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
function App() {
  const [liffObject, setLiffObject] = useState<Liff>();
  const [liffError, setLiffError] = useState(null);
  const [lifeProfile, setLifeProfile] = useState<string>("");

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
        <p>JWT : {lifeProfile}</p>
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
        console.log(
          "liff url",
          liff.permanentLink.createUrlBy(
            "https://nut41tank.github.io/?ref=5000"
          )
        );
        if (liffObject?.isLoggedIn) {
          console.log(
            "liffObject.getDecodedIDToken",
            liffObject.getDecodedIDToken()
          );
          const decodedToken = liffObject.getDecodedIDToken;
          console.log("decodedToken email", decodedToken()?.name);

          // Ensure the returned value is an object
          if (typeof decodedToken === "object" && decodedToken !== null) {
            // Iterate over the keys of the object
            const stringifiedResult = Object.keys(decodedToken).reduce(
              (result, key) => {
                // Use dynamic property access
                const value = decodedToken[key as keyof typeof decodedToken];

                // Stringify the value and store it in the result
                result[key] = JSON.stringify(value);
                return result;
              },
              {} as Record<string, string>
            );

            console.log("Stringified Result:", stringifiedResult);

            // Optionally, stringify the entire result object
            const entireStringifiedObject = JSON.stringify(stringifiedResult);
            console.log("Entire Stringified Object:", entireStringifiedObject);

            // Update state or handle the stringified object
            setLifeProfile(entireStringifiedObject);
          } else {
            console.warn("getDecodedIDToken did not return an object.");
          }
        }
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
