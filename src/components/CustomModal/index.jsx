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
	} = props;

	return (
		<ComposedModal
			open={showModal}
			onClose={() => closeModal(false)}
		>
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
					className={`${styles.modaButton} ${styles.primaryButton}`}
					kind="primary"
					onClick={() => handleSubmit()}
				>
					{primaryButton}
				</Button>
			</ModalFooter>
		</ComposedModal>
	);
};
export default CustomModal;
