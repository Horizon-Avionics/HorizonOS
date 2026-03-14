import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {


  return (
    <main className="container">
        <div className="graphbox1"></div>
        <div className="graphbox2"></div>
        <div className="graphbox3"></div>
        <div className="graphbox4"></div>
        <div className="graphbox5"></div>
        <div className="graphbox6"></div>
        <div className="graphbox7"></div>
        <div className="graphbox8"></div>
        <div className="titleBox"></div>
        <div 
          style={{
            position: "absolute", 
            left: "525px", 
            top: "945px", 
            fontSize: 10
          }}>
           <h2>
                Incoming Packet:
           </h2> 
        </div>
        <div className="mainData"></div>
        <div 
          style={{
            position: "absolute", 
            left: "1025px", 
            top: "350px", 
            fontSize: "20px"
          }}>
           <h1>
                Altitude:
           </h1> 
        </div>
        <div 
          style={{
            position: "absolute", 
            left: "1025px", 
            top: "425px", 
            fontSize: "13px"
          }}>
           <h1>
                Detected State: 
           </h1> 
        </div>
        <div 
          style={{
            position: "absolute", 
            left: "1025px", 
            top: "495px", 
            fontSize: "13px"
          }}>
           <h1>
                Pyro Channels:
           </h1> 
        </div>
        <div
          style={{
            position: "absolute",
            zIndex: 40,
            left: "530px",
            top: "375px",
            fontSize: "15px",
            color: "#FFFFFF"
          }}
        >
          <h1>Latitude:</h1>
        </div>

        <div
          style={{
            position: "absolute",
            zIndex: 40,
            left: "530px",
            top: "420px",
            fontSize: "15px",
            color: "#FFFFFF"
          }}
        >
          <h1>Longitude:</h1>
        </div>
        <div className="subData"></div>
        <div className="subData2"></div>
 
    </main>
  );
}

export default App;
