/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import React from 'react'
import DrawerWithHeader from '../../../components/endusers/Drawer/DrawerComponent'
import FooterComponent from '../../../components/endusers/FooterCompnt/Footer'
import EUInboxSendMessageComponent from '../../../components/endusers/inbox/EUInboxSendMessageComponent'

class EUInboxSendMessage extends React.Component {

  render () {
    return (
      <div className='main-content' id='panel'>
        <DrawerWithHeader />
        {/* ---------- Header Starts ------------- */}
        <EUInboxSendMessageComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default EUInboxSendMessage
