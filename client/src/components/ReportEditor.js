import React, {useRef, useState} from 'react';
import Datetime from 'react-datetime';
import axios from 'axios';
import "react-datetime/css/react-datetime.css";

import {Button, Modal} from 'react-bootstrap';

function ReportEditor({handleOKMsg, handleErrMsg, handleRefresh}) {
    const [dlgOpen,setDlgOpen] = useState(false);
    const [rptDate,setRptDate] = useState(new Date());
    const addr_string = useRef("");
    const postal_code = useRef("");
    const city = useRef("");
    const prov = useRef("");
    const rptId = useRef("");
    const inc_details = useRef("");

    const openForm = (event) => {
        setDlgOpen(true);
    }

    const closeForm = (event) => {
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
console.log("Sending report to db");
        axios.post('/api/reports', rptPayload)
            .then((res) => {
            console.log(res);
                handleOKMsg(`Report saved`);
                //handleRefresh();
                setDlgOpen(false);
            })
            .catch((error) => {
                handleErrMsg(`Unable to save report`);
                console.log(error);
            });
        
    }
    return (
        <>
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
                                    <input name="address_string" ref={addr_string} title="123 Fake St" id="address_string"></input>
                                    <br/>
                                    <input name="pcode" id="pcode" ref={postal_code} title="Enter the postal code or leave blank if you don't know it"/>
                                    <input name="city" id="city" ref={city} defaultValue="Ottawa"></input>
                                    <br/>
                                    <select name="province" ref={prov} defaultValue="ON">
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