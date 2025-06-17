import "./App.scss";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import BackgroundGrid from "./components/BackgroundGrid/BackgroundGrid";
import { useState } from "react";

function App() {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };
  return (
    <>
      <BackgroundGrid maxSpeed={100} />
      <Footer />
      <Content isVisible={isContentVisible} />
      <Header toggleContent={toggleContent} />
      <CustomCursor />
    </>
  );
}

export default App;
