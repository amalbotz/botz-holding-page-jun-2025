import "./App.scss";
import Header from "./components/Header/Header";
import Content from "./components/Content/Content";
import Footer from "./components/Footer/Footer";
import CustomCursor from "./components/CustomCursor/CustomCursor";
import BackgroundGrid from "./components/BackgroundGrid/BackgroundGrid";
import { useState, useRef, useEffect } from "react";
import TitleRenderer from "./components/TitleRenderer/TitleRenderer";
import Overlay from "./components/Overlay/Overlay";
import styles from "./App.module.scss";

function App() {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isSuperformVisible, setIsSuperformVisible] = useState(false);
  const [isCookiePolicyVisible, setIsCookiePolicyVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleContent = (shouldOpen?: boolean) => {
    setIsSuperformVisible(false);
    setIsCookiePolicyVisible(false);
    setIsContentVisible(shouldOpen ?? !isContentVisible);
  };

  const toggleSuperform = (shouldOpen?: boolean) => {
    setIsContentVisible(false);
    setIsCookiePolicyVisible(false);
    setIsSuperformVisible(shouldOpen ?? !isSuperformVisible);
  };

  const toggleCookiePolicy = (shouldOpen?: boolean) => {
    setIsContentVisible(false);
    setIsSuperformVisible(false);
    setIsCookiePolicyVisible(shouldOpen ?? !isCookiePolicyVisible);
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
      <Footer toggleCookiePolicy={toggleCookiePolicy} />
      <Overlay isVisible={isContentVisible} toggle={toggleContent}>
        <Content />
      </Overlay>
      <Overlay isVisible={isSuperformVisible} toggle={toggleSuperform}>
        <div className={styles.ytWrapper}>
          <iframe
            ref={iframeRef}
            className={styles.yt}
            src="https://www.youtube.com/embed/949eYdEz3Es?si=LaUgHELemZY2JtLR&amp;controls=0&amp;loop=1&amp;autoplay=1&amp;mute=1&amp;playlist=949eYdEz3Es&amp;enablejsapi=1"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
          <a
            className={styles.ytCaption}
            href="https://www.youtube.com/watch?v=949eYdEz3Es"
            target="_blank"
          >
            Octopus escaping through a 1 inch diameter hole by James Wood [→]
          </a>
        </div>
      </Overlay>
      <Overlay isVisible={isCookiePolicyVisible} toggle={toggleCookiePolicy}>
        <p>This is the cookie stuff</p>
      </Overlay>
      <Header toggleContent={toggleContent} toggleSuperform={toggleSuperform} />
      <CustomCursor />
    </>
  );
}

export default App;
