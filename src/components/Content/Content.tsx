import styles from "./Content.module.scss";
import copy from "../../data/copy.json";
import MailChimpSignup from "../MailChimpSignup/MailChimpSignup";

const Content = () => {
  return (
    <div className={styles.root}>
      <div className={styles.info}>
        {copy.info.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <MailChimpSignup
        listId="3abbde466b"
        user="4f99e8cb5eb9360cc6519d150"
        datacenter="botzinnovation.us20"
      />
    </div>
  );
};

export default Content;
