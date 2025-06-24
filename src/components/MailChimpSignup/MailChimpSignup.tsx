import { useState } from "react";
import type { ChangeEvent } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";
import styles from "./MailChimpSignup.module.scss";

interface FormData {
  FNAME: string;
  LNAME: string;
  EMAIL: string;
}

interface MailChimpSignupProps {
  listId: string;
  user: string;
  datacenter: string;
}

const MailChimpSignup = ({
  user,
  listId,
  datacenter,
}: MailChimpSignupProps) => {
  const [formData, setFormData] = useState<FormData>({
    FNAME: "",
    LNAME: "",
    EMAIL: "",
  });

  // Create the URL for the Mailchimp form - using the standard format for client-side subscription
  // Format: https://<dc>.list-manage.com/subscribe/post?u=<u>&id=<id>
  const url = `https://${datacenter}.list-manage.com/subscribe/post?u=${user}&id=${listId}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.root}>
      <MailchimpSubscribe
        url={url}
        render={({ subscribe, status, message }) => (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                subscribe(formData);
              }}
            >
              <input
                type="text"
                name="FNAME"
                placeholder="FIRST NAME"
                value={formData.FNAME}
                onChange={handleChange}
                required
                aria-label="First name"
              />
              <input
                type="text"
                name="LNAME"
                placeholder="LAST NAME"
                value={formData.LNAME}
                onChange={handleChange}
                required
                aria-label="Last name"
              />
              <input
                type="email"
                name="EMAIL"
                placeholder="EMAIL ADDRESS"
                value={formData.EMAIL}
                onChange={handleChange}
                required
                aria-label="Email address"
              />
              <div className={styles.buttonWrapper}>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{ display: status === "sending" ? "none" : "" }}
                >
                  [ SIGN UP ]
                </button>
                {status === "sending" && (
                  <div className={styles.message}>Subscribing...</div>
                )}
                {status === "error" && (
                  <div className={`${styles.message} ${styles.error}`}>
                    {message as string}
                  </div>
                )}
                {status === "success" && (
                  <div className={`${styles.message} ${styles.success}`}>
                    Thank you for subscribing!
                  </div>
                )}
              </div>
            </form>
          </>
        )}
      />
    </div>
  );
};

export default MailChimpSignup;
