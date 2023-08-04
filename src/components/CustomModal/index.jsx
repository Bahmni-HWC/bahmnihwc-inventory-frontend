import {
	Button,
	ComposedModal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from "carbon-components-react";
import React from "react";
import styles from "./customModal.module.scss";

const CustomModal = (props) => {
	const {
		showModal,
		subTitle,
		primaryButton,
		secondaryButton,
		handleSubmit,
		closeModal,
		children,
		invalid,
	} = props;

	return (
		<ComposedModal open={showModal} onClose={() => closeModal(false)} size="lg">
			<ModalHeader>
				<h3>{subTitle}</h3>
			</ModalHeader>
			<ModalBody hasForm style={{ width: "100%" }}>
				{children}
			</ModalBody>
			<ModalFooter>
				<Button
					className={styles.modaButton}
					kind="secondary"
					onClick={() => closeModal(false)}
				>
					{secondaryButton}
				</Button>
				<Button
					className={`${styles.modaButton} ${
						!invalid ? styles.primaryButton : styles.disabledButton
					}`}
					kind="primary"
					onClick={() => handleSubmit()}
					disabled={invalid}
				>
					{primaryButton}
				</Button>
			</ModalFooter>
		</ComposedModal>
	);
};
export default CustomModal;
