import React from 'react'
import { t } from 'ttag'
import { hashHistory } from 'react-router'
import ADHostsEditHostComponent from '../../../components/admin/Hosts/ADHostsEditHostComponent'
import DrawerWithHeader from '../../../components/admin/Drawer/DrawerComponent'
import FooterComponent from '../../../components/admin/footer/Footer'
class ADHostsEditHostScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.handleHome = this.handleHome.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }

  handleHome () {
    hashHistory.push('/admin/home')
    event.preventDefault()
  }

  handleBack () {
    hashHistory.push('/admin/hosts')
  }

  render () {
    return (
      <div>
        <DrawerWithHeader />
        {/* <DrawerWithHeader /> */}
        {/* ---------- Header Starts ------------- */}
        <div className='header bg-primary pb-6'>
          <div className='container-fluid'>
            <div className='header-body'>
              <div className='row align-items-center py-4'>
                <div className='col-lg-6 col-7'>
                  <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADTitleHostsHosts`}</h6>
                  <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                    <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                      <li className='breadcrumb-item'><a onClick={this.handleHome}><i className='fas fa-home' /></a></li>
                      <li className='breadcrumb-item'><a onClick={this.handleBack} >{ t`lanADTitleHostsHostsList` } </a></li>
                      <li className='breadcrumb-item active' aria-current='page'>{ t`lanADLabelHostsEditHost` }</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>{/* ---------- Header Ends ------------- */}
        <ADHostsEditHostComponent />
        <FooterComponent />
      </div>
    )
  }
}

export default ADHostsEditHostScreen
