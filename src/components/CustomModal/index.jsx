import React, { useEffect, useState } from 'react';
import { ComposedModal, ModalHeader, ModalBody, TextInput, Button, ModalFooter } from "carbon-components-react";
import { postRequest, invItemURL } from "../../utils/api-utils";
import styles from "./customModal.module.scss";

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
        closeModal } = props;
    const [ modifiedData, setModifiedData ] = useState(data);
    const [ postError, setPostError ] = useState('');
    const [ editMode, setEditMode ] = useState({ "id": -1, "value": 0 });

    /**
     * description. send the post request with updated dispense as payload
     * @namespace submitDespense
     * @memberof  CustomModal
     * @property {array} payload modified dispense data.
    */

    const submitDespense = async (payload) => {
        const items = await postRequest(invItemURL, payload)
        const responseData = await items.json();
        if(error) {
            setPostError(error.message);
          } else {
            handleSubmit(responseData);
            closeModal(false)
          }
    }

    /**
     * description. handle the editable input field and update the dispense data obj
     * @namespace handleEditMode
     * @memberof  CustomModal
     * @property {object} e current click event.
     * @property {number} id index of modified dispense data.
    */

    const handleEditMode = (e, id) => {
        e.preventDefault();
        const targetValue = e && e.target && e.target.value;
        if (targetValue && !/^[1-9]\d*(\.\d+)?$/.test(targetValue)) {
            return false;
        } else {
            handleChange(targetValue, id);
            setEditMode({ "id": id, "value": targetValue });
        }  
    }

    /**
     * description. check if data is modified or not
     * @namespace isUpdate
     * @memberof  CustomModal
     * @property {object} obj orginal dispense data.
     * @property {object} modifiedObj modified dispense data.
    */
    const isUpdate = (obj, modifiedObj) => {
        return modifiedObj.find((item, index) => parseInt(item.quantity) !== parseInt(obj[index].quantity))
    }
    
    /**
     * description. Modified the dispense data with updated quantity
     * @namespace handleChange
     * @memberof  CustomModal
     * @property {number} targetValue modified dispense quantity.
     * @property {number} index index of edit object.
    */
    const handleChange = (targetValue, index) => {
        modifiedData.dispense_drugs = modifiedData?.dispense_drugs?.map((item, i) => (index === i ? { ...item, ['quantity']: parseInt(targetValue) } : item ));
        setModifiedData(modifiedData) 
    }

    useEffect(() => {
        console.log('load modal')
    }, [modifiedData])

    return (
        <ComposedModal
            className={rootClass}
            open={showModal}
          >
            <ModalHeader onRequestClose={() => typeof closeModal === 'function' && closeModal(false)}>
                <h4>{subTitle}</h4>
                <h3>{data?.name}</h3>
            </ModalHeader>
            <ModalBody hasForm>
                <div className={modalListClass}>
                    {tabs && tabs.map((item) => <div>{item}</div>)}
                </div>
                <section className={styles.modalListSection}>
                    {modifiedData?.dispense_drugs?.map((item, index) => <div className={modalListClass}>
                        <h5>{item.name}</h5>
                        <TextInput
                            title="number only"
                            value={
                                editMode.id === index
                                ? editMode.value
                                : item.quantity} id={item.id}
                            onChangeCapture={(e) => handleEditMode(e, index)}
                        />
                    </div>)}
                </section>
            </ModalBody>
            <ModalFooter>
                <Button
                    className={styles.modaButton}
                    kind="secondary"
                    onClick={() => closeModal(false) }>
                        {secondaryButton}
                </Button>
                <Button
                    className={styles.modaButton}
                    kind="primary"
                    disabled={!isUpdate(data?.dispense_drugs, modifiedData?.dispense_drugs)}
                    onClick={() => submitDespense(modifiedData)}>
                        {primaryButton}
                </Button>
            </ModalFooter>
          </ComposedModal>
    )
}
export default CustomModal;