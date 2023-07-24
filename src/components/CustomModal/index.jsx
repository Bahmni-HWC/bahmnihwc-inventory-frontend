import React, { useEffect, useState } from "react";
import {
	ComposedModal,
	ModalHeader,
	ModalBody,
	TextInput,
	Button,
	ModalFooter,
	Grid,
} from "carbon-components-react";
import { postRequest, invItemURL } from "../../utils/api-utils";
import styles from "./customModal.module.scss";
import DrugItemDetails from "../../inventory/dispense/drug-item-details";

const CustomModal = (props) => {
	const {
		data,
		showModal,
		rootClass,
		modalListClass,
		subTitle,
		primaryButton,
		secondaryButton,
		tabs,
		handleSubmit,
		closeModal,
		patient,
	} = props;
	const [modifiedData, setModifiedData] = useState(data);
	const [postError, setPostError] = useState("");
	const [editMode, setEditMode] = useState({ id: -1, value: 0 });

	const submitDespense = async (payload) => {
		const res = await postRequest(invItemURL, payload);
		const responseData = await res.json();
		if (res.error) {
			setPostError(res.error.message);
		} else {
			handleSubmit(responseData);
			closeModal(false);
		}
	};

	const isUpdate = (obj, modifiedObj) => {
		return modifiedObj.find(
			(item, index) => parseInt(item.quantity) !== parseInt(obj[index].quantity)
		);
	};

	useEffect(() => {
		console.log("load modal");
	}, [modifiedData]);

	return (
		<ComposedModal
			className={rootClass}
			open={showModal}
			onClose={() => closeModal(false)}
		>
			<ModalHeader
				onRequestClose={() =>
					typeof closeModal === "function" && closeModal(false)
				}
			>
				<h4>{subTitle}</h4>
				<h3>{data?.name}</h3>
			</ModalHeader>
			<ModalBody hasForm style={{width:'100%'}}>
				<DrugItemDetails data={data} />
				{/* <div className={styles.error}>{postError}</div> 
				 <div className={modalListClass}>
					{tabs && tabs.map((item) => <div>{item}</div>)}
				</div>
				<section className={styles.modalListSection}>
					{modifiedData?.dispense_drugs?.map((item, index) => (
						<div className={modalListClass}>
							<h5>{item.name}</h5>
							<TextInput
								title="number only"
								value={editMode.id === index ? editMode.value : item.quantity}
								id={item.id}
								onChangeCapture={(e) => handleEditMode(e, index)}
							/>
						</div>
					))}
				</section>  */}
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
					className={styles.modaButton}
					kind="primary"
					// disabled={
					// 	!isUpdate(data?.dispense_drugs, modifiedData?.dispense_drugs)
					// }
					onClick={() => submitDespense(modifiedData)}
				>
					{primaryButton}
				</Button>
			</ModalFooter>
		</ComposedModal>
	);
};
export default CustomModal;
