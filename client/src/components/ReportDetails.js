import React from 'react';
import moment from 'moment';
import './ReportDetails.css';

function ReportDetails({report}) {

    return (
        <div className="rptDetails">
            {report != null ?
                <div className="rpt-table">
                    <div className="rpt-row">
                        <div className="rpt-col rpt-label">Time of Incident:</div>
                        <div className="rpt-col">{moment(report.incident_date).format("ddd MMM DD YYYY h:mm a")}</div>
                    </div>
                    <div className="rpt-row">
                        <div className="rpt-col rpt-label">Bylaw Incident ID:</div>
                        <div className="rpt-col">{report.bylaw_rpt_id.length > 0 ? report.bylaw_rpt_id : 'none specified'}</div>
                    </div>
                    <div className="rpt-row">
                        <div className="rpt-col rpt-label">Address:</div>
                        <div className="rpt-col">{report.address_string}</div>
                    </div>
                    <div className="rpt-row">
                        <div className="rpt-col rpt-label">Incident Details:</div>
                        <div className="rpt-col">{report.incident_details}</div>
                    </div>
                </div>
            :
                <div className="emptyNotice">
                    <span>Please select a report from the map</span>
                </div>
            }
        </div>

    )
}
export default ReportDetails;