import { ToastNotification } from "carbon-components-react";
import React from "react";
import styles from "./response-notification.scss";

export const ResponseNotification = (kind, title, message, setFunction = () =>{}) => {
  
  return (
      <ToastNotification
        className="response-notification-container"
        kind={kind}
        lowContrast={true}
        title={title}
        subtitle={message}
        timeout={5000}
        onClose={() => setFunction(false)}
      />
  );
}