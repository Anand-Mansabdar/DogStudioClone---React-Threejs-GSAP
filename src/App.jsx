import React from "react";
import "./App.css";
import HeroDog from "./components/HeroDog";
import { Canvas } from "@react-three/fiber";

const App = () => {
  return (
    <>
      <Canvas>
        <HeroDog />
      </Canvas>
    </>
  );
};

export default App;
