import React, { useState } from 'react';
import { ComposedModal, ModalHeader, ModalBody, TextInput, Button, ModalFooter } from "carbon-components-react";

const CustomModal = (props) => {
    
    const {
        data,
        showModal,
        rootClass,
        modalListClass,
        primaryButton,
        secondaryButton,
        tabOne,
        tabTwo,
        handleSubmit, 
        closeModal } = props;

    const [ modifiedData, setModifiedData ] = useState(data);
    const [ editMode, setEditMode ] = useState(false);

    const handleChange = (e) => {
        const targetValue = e && e.target && e.target.value;
        console.log('targetValue', targetValue)
    }

    return (
        <ComposedModal
            className={rootClass}
            open={showModal}
          >
            <ModalHeader onRequestClose={() => typeof closeModal === 'function' && closeModal(false)}>
                <h4>Dispense drug for</h4>
                <h3>{data?.name}</h3>
            </ModalHeader>
            <ModalBody hasForm>
                <div className={modalListClass}>
                    <div>{tabOne}</div>
                    <div>{tabTwo}</div>
                </div>
                {modifiedData?.dispense_drugs?.map((item) => <div className={modalListClass}>
                    <h5>{item.name}</h5>
                    <TextInput value={item.quantity} id={item.id} onChange={(e) => handleChange(e)}/>
                </div>)}
            </ModalBody>
            <ModalFooter>
                <Button
                kind="secondary"
                onClick={() => closeModal(false) }>
                    {secondaryButton}
                </Button>
                <Button
                kind="primary"
                disabled={!editMode}
                onClick={() => handleSubmit(false)}>
                    {primaryButton}
                </Button>
            </ModalFooter>
          </ComposedModal>
    )
}
export default CustomModal;