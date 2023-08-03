import { ToastNotification } from "carbon-components-react";
import React from "react";

export const ResponseNotification = (kind, title, message, setFunction = () =>{}) => {
  const styles = {
    container: {
      position: 'fixed',
      top: '50px',
      right: '30px',
      '@media (max-width: 768px)': {
        top: '30px', // Adjust top position for smaller devices
        right: '20px', // Adjust right position for smaller devices
      },
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