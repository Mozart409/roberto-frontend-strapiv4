import type * as React from "react";
import type { EmailSchema } from "../actions";

export const EmailTemplate: React.FC<Readonly<EmailSchema>> = ({
  username,
  message,
  email,
  phonenumber,
  subject,
}) => (
  <div>
    <h1>Email von ideal-coaching.com</h1>
    <p>
      <strong>Name:</strong> {username}
    </p>
    <p>
      <strong>Email:</strong> {email}
    </p>
    <p>
      <strong>Telefonnummer:</strong> {phonenumber}
    </p>
    <p>
      <strong>Betreff:</strong> {subject}
    </p>
    <p>
      <strong>Nachricht:</strong>
    </p>
    <p>{message}</p>
  </div>
);
