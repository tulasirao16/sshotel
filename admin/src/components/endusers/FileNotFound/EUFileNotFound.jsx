import React from 'react'
import SPHeaderComponent from '../../../components/serviceproviders/HeaderCompnt/HeaderSignup'

class EUFileNotFound extends React.Component {
  render () {
    return (
      <div>
        <div>
          <SPHeaderComponent />
        </div>
        <div className='container'>
          <div className='row'>
            <div className='col-md-12'>
              <div className='text-center h-50' style={{ marginTop:99 }}>
                <h1 className='text-danger font-weight-bold display-1'>404 File Not Found</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default EUFileNotFound
