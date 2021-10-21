import React from 'react';
import axios from 'axios';
import { Map, Marker,  Overlay, ZoomControl} from "pigeon-maps";
import './ReportMap.css';

function ReportMap({centre, waypoints, selectedWP, setWaypoint, setAddresses}) {

    // Event handlers
    const handleClick = (event) => {
        
        const payload = event.payload;
        setWaypoint(payload);
    }
    const handleMapClick = (event) => {
        //console.log("Map click");
        //console.log(event);
        const [lat,lon] = event.latLng;
        
        axios.get(`/api/reports/addrlup/${lat}/${lon}`)
            .then(res => {
                    console.log(res)
                    if (res.hasOwnProperty('data')) {
                        // Send address array to main app component
                        setAddresses(res.data.data);
                    } else if (res.hasOwnProperty('error')) {
                        alert(res.error);
                    }
                   
            })
            .catch(error => console.log(error));
    }
    const resetRptModal = (event) => {
        setWaypoint(null);
    }
    return (
        <Map height={400} width={600} center={[centre.lat, centre.lon]} defaultZoom={14} onClick={handleMapClick}>
            {waypoints.map((wp) => {
                return (
                    
                    <Marker key={wp._id} 
                            width={25} 
                            anchor={[wp.lat, wp.lon]}
                            payload={wp} 
                            color={selectedWP != null && selectedWP._id === wp._id ? 'yellow' : 'red'}
                            onClick={handleClick} />
                )
            })}
            {/** 
             * to display a pop-up text on the map, we have to use an overlay from the Pigeon
             * library that we're using to display the map. Bootstrap Modal just won't show up.
             */}
            {selectedWP != null &&
                <Overlay anchor={[selectedWP.lat, selectedWP.lon]}>
                    <div className="rptOverlay">
                        
                        <p className="modal-title">{selectedWP.address_string}</p>
                        <button type="button" className="btn-close" onClick={resetRptModal}>X</button>
                             
                    </div>
                </Overlay>
            }
            <ZoomControl />
            </Map>
    )

}
export default ReportMap;