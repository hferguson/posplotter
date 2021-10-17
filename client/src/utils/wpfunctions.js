

/**
   * Centres the map based on waypoints passed in
   * @param  waypoints 
   */
export function getCentrePoint(waypoints) {
    let avgLat = 0;
    let avgLon = 0;
    //console.log(`Setting center based on ${waypoints}`);
    const numPts = waypoints.length;
    let wpCount = 0;
    if (numPts >0) {
      for (let i=0;i<numPts;i++) {
          const wp = waypoints[i];
          //console.log(`Waypoint ${wp._id}: ${wp.lat} ${wp.lon}`);
          if (!isNaN(wp.lat) && !isNaN(wp.lon)) {
            wpCount++;
            avgLat += wp.lat;
            avgLon += wp.lon;
          }
          
      }
      if (wpCount>0) {
        avgLat = avgLat/wpCount;
        avgLon = avgLon/wpCount;
        console.log(`Calculated center: ${avgLat}, ${avgLon}`);
      }
      
    }
     
    return {
      'lat': avgLat,
      'lon': avgLon
    }
  }
