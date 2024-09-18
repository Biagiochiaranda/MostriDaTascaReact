import React from 'react';
import CommunicationController from './CommunicationController';
import StorageManager from './StorageManager';

class ClassificaVM extends React.Component {

    static async richiestaClassifica() {
        return await CommunicationController.getClassifica();
    }



}
export default ClassificaVM;