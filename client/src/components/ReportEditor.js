import React, {useEffect, useRef, useState} from 'react';
import Datetime from 'react-datetime';
import axios from 'axios';
import {getValFromObj, setValOnDOMRef} from '../utils/wpfunctions.js';
import "react-datetime/css/react-datetime.css";

import {Button, Modal} from 'react-bootstrap';

/**
 * This component will always display a Report button that when clicked will
 * open a modal dialog with a form to enter report info.
 * TODO: tie this in with the address list component so we can 
 * pre-populate with the address when the user selects an address from that
 * po-up (See AddressListDlg)
 * @param {handleOKMsg} - handles case where form returns OK
 * @param {handleErrMsg} - handles case where form returns an error
 * @param {resetAddress} - used to reset the state component in the parent that sets prefilAddress
 * @param {prefilAddress} - use this address object to prefil the form (including co-ordinates)
 * @returns JSX component
 */
function ReportEditor({handleOKMsg, handleErrMsg, resetAddress, prefilAddress}) {
    const [dlgOpen,setDlgOpen] = useState(false);
    const [rptDate,setRptDate] = useState(new Date());
    // These get prefilled if user had clicked on map instead of entering an address.
    const init_addr = getValFromObj(prefilAddress, 'name')
    const addr_string = useRef(init_addr);
    const init_pcode = getValFromObj(getValFromObj(prefilAddress, 'postalcode'))
    const postal_code = useRef("");
    const init_city = getValFromObj(prefilAddress, 'locality');
    const city = useRef("");
    const init_prov = getValFromObj(prefilAddress, 'region_code');
    const prov = useRef("");
    const rptId = useRef("");
    const inc_details = useRef("");

    
   
    const openForm = (event) => {
        setDlgOpen(true);
    }

    const closeForm = (event) => {
        resetAddress(null);
        setDlgOpen(false);
    }

    const submitReport = (event) => {
       
        let rptPayload = {};
        if (rptDate._isAMomentObject) 
            rptPayload["incident_date"] = rptDate._d;
        else
            rptPayload["incident_date"] = rptDate;
        rptPayload["incident_details"] = inc_details.current.value;
        rptPayload["bylaw_rpt_id"] = rptId.current.value;
        rptPayload["address_string"] = addr_string.current.value;
        rptPayload["postal_code"] = postal_code.current.value;
        rptPayload["city"] = city.current.value;;
        rptPayload["province"] = prov.current.value;
        
        // If we have co-ordinates (user clicked on map), pass them in 
        // and then we only have to insert rather than query the database
        if (prefilAddress != null) {
            if (!isNaN(prefilAddress.latitude) && !isNaN(prefilAddress.longitude)) {
                rptPayload["lat"] = prefilAddress.latitude;
                rptPayload["lon"] = prefilAddress.longitude;
            }
        }
        axios.post('/api/reports', rptPayload)
            .then((res) => {
                handleOKMsg(`Report saved`);
                resetAddress(null);
                setDlgOpen(false);
            })
            .catch((error) => {
                handleErrMsg(`Unable to save report`);
                setDlgOpen(false);
                resetAddress(null);
                console.log(error);
            });
        
    }

    useEffect(() => {
        setDlgOpen(prefilAddress != null);
        
    }, [prefilAddress]);

    return (
        <>
        {(prefilAddress != null) ? console.log(`Have prefil address ${prefilAddress.name}, dlgOpen=${dlgOpen}`) : console.log("no prefil address")}
            <Modal animation={false} show={dlgOpen} onHide={closeForm}>
                <Modal.Header closeButton>
                    <Modal.Title>Incident Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <table className="table">
                        <tbody>
                            <tr>
                                <td>Time of incident</td>
                                <td>
                                    <Datetime value={rptDate} onChange={setRptDate} />
                                </td>
                            </tr>
                            <tr>
                                <td>Indicent number (if known)</td>
                                <td><input ref={rptId} name="bylawRptId" id="bylawRptId"></input></td>
                            </tr>
                            <tr>
                                <td>Address where disturbance came from</td>
                                <td>
                                    <input name="address_string" ref={addr_string} title="123 Fake St" id="address_string" defaultValue={init_addr}></input>
                                    <br/>
                                    <input name="pcode" id="pcode" ref={postal_code} defaultValue={init_pcode} title="Enter the postal code or leave blank if you don't know it"  />
                                    <input name="city" id="city" ref={city} defaultValue={init_city}></input>
                                    <br/>
                                    <select name="province" ref={prov} defaultValue={init_prov}>
                                        <option value="AB">Alberta</option>
                                        <option value="BC">British Columbia</option>
                                        <option value="MB">Manitoba</option>
                                        <option value="NB">New Brunswick</option>
                                        <option value="NL">Newfoundland</option>
                                        <option value="NS">Nova Scotia</option>
                                        <option value="ON">Ontario</option>
                                        <option value="PEI">Prince Edward Island</option>
                                        <option value="QC">Quebec</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2">Please describe the incident</td>
                            </tr>
                            <tr>    
                                <td colSpan="2">
                                    <textarea ref={inc_details} id="incident_details" name="incident_details"></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={submitReport}>
                        SendReport
                    </Button>
                    <Button variant="secondary" onClick={closeForm}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <button className="rptEditBtn" onClick={openForm}>Add your report</button>
            <button className="rptEditBtn" onClick={() => handleOKMsg("test")}>Test dlg msg</button>
            <button className="rptEditBtn" onClick={() => handleErrMsg("test")}>Test err msg</button>
        </>
    )
}

export default ReportEditor;