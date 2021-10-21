import React, {useState} from 'react';
import {Button, Modal} from 'react-bootstrap';

function AddressListDlg({addresses, addressHandler}) {
    
    const closeForm = (event) => {
        addressHandler(null);
    } 

    const setAddress = (event) => {
        let chboxes = document.querySelectorAll('input[name="selectedAddress"]');
        for (const cb of chboxes) {
            if (cb.checked) {
                const idx = cb.value;
                console.log(`selected row ${idx}`)
                addressHandler(addresses[idx]);
                break;
            }
        }
    }
    return(
            <>
                <Modal animation={false} show={addresses.length > 0} onHide={closeForm}>
                    <Modal.Header closeButton>
                        <Modal.Title>Incident Report</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <table className="table">
                        <tbody>
                            {(addresses != null  && addresses.length > 0) &&
                                addresses.map((address,idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>
                                                <input type="radio" name="selectedAddress" defaultChecked={idx === 0} value={idx}></input>
                                            </td>
                                            <td>{address.label}</td>
                                        </tr> 
                                    )
                            })}
                        </tbody>
                    </table>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="primary" onClick={setAddress}>
                        Select this address
                    </Button>
                    <Button variant="secondary" onClick={closeForm}>
                        Cancel
                    </Button>
                </Modal.Footer>
                </Modal>
            </>
    )
} 
export default AddressListDlg;