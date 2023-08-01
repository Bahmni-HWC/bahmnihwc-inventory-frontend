import { InlineNotification } from "carbon-components-react";
import React from "react";

export const ResponseNotification = (kind, title, message, setFunction = () =>{}) => {
  return (
		    <InlineNotification
                kind={kind}
                lowContrast={true}
                title={title}
                subtitle={message}
                timeout={5000}
                onClose={() => setFunction(false)}
            />
  );
};
