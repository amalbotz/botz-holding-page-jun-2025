import styles from "./Header.module.scss";

const Header = ({
  toggleContent,
}: {
  toggleContent: (shouldOpen?: boolean) => void;
}) => {
  return (
    <header className={styles.root}>
      <h1 onClick={() => toggleContent(false)}>[ BOTZ ]</h1>
      <nav>
        <button onClick={() => toggleContent()}>[ INFO ]</button>
      </nav>
    </header>
  );
};

export default Header;
