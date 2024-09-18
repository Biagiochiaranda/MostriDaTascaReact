import React from 'react';
import * as Location from 'expo-location';

class PermissionRequester extends React.Component{

  static async locationPermissionAsync() {
    //console.log("requesting location permission...")
    let canUseLocation = false;

    try {
      const grantedPermission = await Location.getForegroundPermissionsAsync()

      if (grantedPermission.status === "granted") {
        canUseLocation = true;
      } else {
        const permissionResponse = await Location.requestForegroundPermissionsAsync()

        if (permissionResponse.status === "granted") {
          canUseLocation = true;
        }
      }

      if (canUseLocation) {
        const location = await Location.getCurrentPositionAsync()
        //console.log("received location:", location);
        return [location, canUseLocation];
      }
    } catch (error) {
      console.error('Errore durante la richiesta di permessi o ottenimento della posizione:', error);
      return "error"
    }
  }





}

export default PermissionRequester; 
