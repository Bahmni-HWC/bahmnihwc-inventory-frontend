import { ToastNotification } from "carbon-components-react";
import React from "react";

export const ResponseNotification = (kind, title, message, setFunction = () =>{}) => {
  const styles = {
    container: {
      position: 'fixed',
      top: '50px',
      right: '30px',
    },
  };
  return (
    <div style={styles.container}>
      <ToastNotification
        kind={kind}
        lowContrast={true}
        title={title}
        subtitle={message}
        timeout={5000}
        onClose={() => setFunction(false)}
      />
    </div>
  );
};