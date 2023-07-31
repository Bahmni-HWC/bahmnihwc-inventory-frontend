import { InlineNotification } from "carbon-components-react";
import React from "react";

export const notification = (kind, title, message) => {
  return (
    <div>
		    <InlineNotification
                kind={kind}
                title={title}
                subtitle={message}
            />
    </div>
  );
};
