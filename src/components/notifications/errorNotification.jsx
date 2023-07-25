import { InlineNotification } from "carbon-components-react";
import React from "react";

export const errorNotification = (message) => {
  return (
    <div>
		    <InlineNotification
                kind="error"
                title="Error"
                subtitle={message}
            />
    </div>
  );
};
