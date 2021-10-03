import React from 'react';
import { Map, Marker,  Overlay, ZoomControl} from "pigeon-maps";
import './ReportMap.css';

function ReportMap({centre, waypoints, selectedWP, setWaypoint}) {

    // Event handlers
    const handleClick = (event) => {
        //console.log(event);
        const payload = event.payload;

        setWaypoint(payload);
    }

    const resetRptModal = (event) => {
        setWaypoint(null);
    }
    return (
        <Map height={400} width={600} center={[centre.lat, centre.lon]} defaultZoom={14}>
            {waypoints.map((wp) => {
                return (
                    
                    <Marker key={wp._id} 
                            width={25} 
                            anchor={[wp.lat, wp.lon]}
                            payload={wp} 
                            onClick={handleClick} />
                )
            })}
            {selectedWP != null &&
                <Overlay anchor={[selectedWP.lat, selectedWP.lon]}>
                    <div className="rptOverlay">
                        
                        <p className="modal-title">{selectedWP.address_string}</p>
                        <button type="button" className="btn-close" onClick={resetRptModal}></button>
                             
                    </div>
                </Overlay>
            }
            <ZoomControl />
            </Map>
    )

}
export default ReportMap;