import styles from "./CookiesDisclaimer.module.scss";

const CookiesDisclaimer = () => {
  return (
    <div className={styles.root}>
      <section>
        <h2>Cookie Policy</h2>
        <p>
          <strong>Effective Date:</strong> August 2025
        </p>
        <p>
          This Cookie Policy explains how <strong>Botz Limited</strong> ("we",
          "us", or "our") uses cookies and similar technologies when you visit
          our website at https://bozinnovation.com ("Website"). It also outlines
          your rights under applicable UK data protection laws, including the{" "}
          <strong>UK General Data Protection Regulation (UK GDPR)</strong> and
          the{" "}
          <strong>
            Privacy and Electronic Communications Regulations (PECR).
          </strong>
        </p>
      </section>

      <section>
        <h3>1. What Are Cookies?</h3>
        <p>
          Cookies are small text files placed on your device when you visit a
          website. They enable the site to remember your actions and preferences
          (such as login, language, or font size) over a period of time.
        </p>
        <p>Cookies may be:</p>
        <ul>
          <li key="1">First-party cookies – Set by us directly.</li>
          <li key="2">
            Third-party cookies – Set by third-party services whose content or
            features are embedded on our Website (e.g., YouTube or Mailchimp).
          </li>
        </ul>
      </section>

      <section>
        <h3>2. How We Use Cookies</h3>
        <p>We use cookies for the following purposes:</p>
        <h4>a) Strictly Necessary Cookies</h4>
        <p>
          These cookies are essential for the proper functioning of the Website.
          They include those that:
        </p>
        <ul>
          <li key="1">Enable core features like page navigation and security.</li>
          <li key="2">Maintain server performance and session integrity.</li>
        </ul>
        <p>These cookies do not require user consent under PECR.</p>

        <h4>b) Third-Party Cookies</h4>
        <p>
          Our Website includes embedded services that may place their own cookies
          on your device:
        </p>
        <ul>
          <li key="1">
            <strong>YouTube (Google LLC)</strong>
            <p>
              We embed videos hosted on YouTube. When you play these videos,
              YouTube may set cookies to:
            </p>
            <ul>
              <li key="1">Track video performance and usage.</li>
              <li key="2">
                Personalise content and ads (if you’re logged into your Google
                account).
              </li>
            </ul>
            <p>
              Learn more in{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube’s Privacy Policy
              </a>
              .
            </p>
          </li>
          <li key="2">
            <strong>Mailchimp (Intuit Inc.)</strong>
            <p>
              We use an embedded Mailchimp sign-up form for our newsletter.
            </p>
            <p>Mailchimp may use cookies to:</p>
            <ul>
              <li key="1">Improve form usability and performance.</li>
              <li key="2">Prevent spam and detect bots.</li>
              <li key="3">Track user interactions for campaign analytics.</li>
            </ul>
            <p>
              More details are available in{" "}
              <a
                href="https://mailchimp.com/legal/cookies/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mailchimp’s Cookie Statement
              </a>
              .
            </p>
          </li>
        </ul>
      </section>

      <section>
        <h3>3. Managing Cookies</h3>
        <p>
          Most web browsers allow you to control cookies through their settings.
          You can choose to block or delete cookies, or to be notified before a
          cookie is placed.
        </p>
        <p>Useful links to manage cookies in common browsers:</p>
        <ul>
          <li key="1">
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chrome
            </a>
          </li>
          <li key="2">
            <a
              href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox
            </a>
          </li>
          <li key="3">
            <a
              href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer"
            >
              Safari
            </a>
          </li>
          <li key="4">
            <a
              href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd"
              target="_blank"
              rel="noopener noreferrer"
            >
              Edge
            </a>
          </li>
        </ul>
        <p>
          Please note that disabling some cookies may affect how the Website
          functions.
        </p>
      </section>

      <section>
        <h3>4. Legal Basis for Use of Cookies</h3>
        <p>Under UK GDPR and PECR:</p>
        <ul>
          <li key="1">
            Essential cookies are used based on our legitimate interest in
            operating a secure and functional website.
          </li>
          <li key="2">
            Non-essential cookies (such as YouTube or Mailchimp cookies) may be
            set by third parties as part of their embedded services. We do not
            control these cookies directly.
          </li>
        </ul>
        <p>
          By continuing to use this Website, you acknowledge the use of cookies
          as described in this policy.
        </p>
      </section>

      <section>
        <h3>5. Updates to This Policy</h3>
        <p>
          We may update this Cookie Policy from time to time to reflect changes
          in our use of cookies or to comply with legal requirements. The latest
          version will always be available at https://bozinnovation.com.
        </p>
      </section>

      <section>
        <h3>6. Contact Us</h3>
        <p>
          If you have any questions or concerns about this Cookie Policy, please
          contact:
        </p>
        <p>
          Botz Limited
          <br />5 Merchant Square
          <br />
          London, W2 1AY
          <br />
          United Kingdom
          <br />📧 Email: contact@botzinnovation.com
        </p>
      </section>
    </div>
  );
};

export default CookiesDisclaimer;
