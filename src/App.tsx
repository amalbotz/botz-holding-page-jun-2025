import "./App.scss";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import BackgroundGrid from "./components/BackgroundGrid/BackgroundGrid";
import { useState, useEffect } from "react";
import TitleRenderer from "./components/TitleRenderer/TitleRenderer";

function App() {
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isContentVisible) {
        setIsContentVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContentVisible]);
  return (
    <>
      <BackgroundGrid maxSpeed={100} />
      <TitleRenderer />
      <Footer />
      <Content isVisible={isContentVisible} toggleContent={toggleContent} />
      <Header toggleContent={toggleContent} />
      <CustomCursor />
    </>
  );
}

export default App;
