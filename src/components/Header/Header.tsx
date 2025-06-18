import styles from "./Header.module.scss";

const Header = ({ toggleContent }: { toggleContent: () => void }) => {
  return (
    <header className={styles.root}>
      <h1>[ BOTZ ]</h1>
      <nav>
        <button onClick={toggleContent}>[ INFO ]</button>
      </nav>
    </header>
  );
};

export default Header;
