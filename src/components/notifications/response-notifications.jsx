import { InlineNotification } from "carbon-components-react";
import React from "react";

export const errorNotification = (message, setError = () =>{}) => {
	return <InlineNotification kind="error" title="Error" subtitle={message} timeout={5000} onClose={()=>setError(false)}/>;
};

export const successNotification = (message, setSuccess = () => {}) => {
	return (
		<InlineNotification
			kind="success"
			lowContrast={true}
			title="Success"
			timeout={5000}
      subtitle={message}
      onClose={() => setSuccess(false)}
		/>
	);
};
