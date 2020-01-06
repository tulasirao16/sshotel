import React from 'react'
import { t } from 'ttag'
import 'react-drawer/lib/react-drawer.css'
import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'
import PropTypes from 'prop-types'
class ADEUUsersListHeaderNav extends React.Component {

  render () {
    return (
      <div className='header bg-primary pb-6'>
        <div className='container-fluid'>
          <div className='header-body'>
            <div className='align-items-center py-4'>
              <div className='col-lg-6 col-7'>
                <h6 className='h2 text-white d-inline-block mb-0'>{t`lanADEUTitleAdminEUUsers`}</h6>
                <nav aria-label='breadcrumb' className='d-none d-md-inline-block ml-md-4'>
                  <ol className='breadcrumb breadcrumb-links breadcrumb-dark'>
                    <li className='breadcrumb-item'><a onClick={this.props.handleHome}><i className='fas fa-home' /></a></li>
                    {
                      this.props.userData && this.props.userData._id
                        ? <li className='breadcrumb-item active'><a onClick={this.props.handleUsers} >{t`lanADEUTitleUsersList`}</a></li>
                        : <li className='breadcrumb-item active'>{t`lanADEUTitleUsersList`}</li>
                    }
                    {
                      this.props.userData && this.props.userData._id
                        ? <li className='breadcrumb-item active' aria-current='page'>{t`lanADEUTitleUsersDetails`}</li>
                        : ''
                    }
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
ADEUUsersListHeaderNav.propTypes = {
  handleHome: PropTypes.func,
  userData: PropTypes.object,
  handleUsers: PropTypes.func
}

export default ADEUUsersListHeaderNav
