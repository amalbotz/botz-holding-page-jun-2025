declare module 'react-mailchimp-subscribe' {
  import { ReactNode } from 'react';

  interface MailchimpSubscribeProps {
    url: string;
    render?: (props: {
      subscribe: (data: any) => void;
      status: null | 'sending' | 'success' | 'error';
      message: string | null;
    }) => ReactNode;
    onSubmitted?: (data: any) => void;
  }

  const MailchimpSubscribe: React.FC<MailchimpSubscribeProps>;
  
  export default MailchimpSubscribe;
}
