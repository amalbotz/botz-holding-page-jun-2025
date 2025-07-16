import "./App.scss";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import BackgroundGrid from "./components/BackgroundGrid/BackgroundGrid";
import { useState, useRef, useEffect } from "react";
import TitleRenderer from "./components/TitleRenderer/TitleRenderer";
import Overlay from "./components/Overlay/Overlay";

function App() {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isSuperformVisible, setIsSuperformVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleContent = (shouldOpen?: boolean) => {
    setIsSuperformVisible(false);
    setIsContentVisible(shouldOpen ?? !isContentVisible);
  };

  const toggleSuperform = (shouldOpen?: boolean) => {
    setIsContentVisible(false);
    setIsSuperformVisible(shouldOpen ?? !isSuperformVisible);
  };

  useEffect(() => {
    if (iframeRef.current) {
      const command = isSuperformVisible ? "playVideo" : "pauseVideo";
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: command,
        }),
        "*"
      );
    }
  }, [isSuperformVisible]);

  return (
    <>
      <TitleRenderer isObscured={isContentVisible} />
      <BackgroundGrid maxSpeed={100} />
      <Footer />
      <Overlay isVisible={isContentVisible} toggle={toggleContent}>
        <Content />
      </Overlay>
      <Overlay isVisible={isSuperformVisible} toggle={toggleSuperform}>
        <div
          style={{
            position: "relative",
            width: "min(100vh, 100vw)",
            aspectRatio: "4/3",
            background: "#000",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <iframe
            ref={iframeRef}
            style={{
              pointerEvents: "none",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100%",
              height: "100%",
              minWidth: "133.33%",
              minHeight: "100%",
            }}
            src="https://www.youtube.com/embed/949eYdEz3Es?si=LaUgHELemZY2JtLR&amp;controls=0&amp;loop=1&amp;autoplay=1&amp;mute=1&amp;playlist=949eYdEz3Es&amp;enablejsapi=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </Overlay>
      <Header toggleContent={toggleContent} toggleSuperform={toggleSuperform} />
      <CustomCursor />
    </>
  );
}

export default App;
