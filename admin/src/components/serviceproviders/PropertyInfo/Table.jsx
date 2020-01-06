import React from 'react'
import 'react-drawer/lib/react-drawer.css'
import BootstrapTable from 'react-bootstrap-table-next'
// import ToolkitProvider, { ColumnToggle } from 'react-bootstrap-table2-toolkit'

import '../css/all.min.css'
import '../css/argon.min.css'
import '../css/nucleo.css'

export default class Table extends React.Component {
  constructor () {
    super()
    this.state = {
      hoverIdx: null
    }
  }

  expandRow = {
    renderer: () => (
      <div className='row'>
        <div className='col-md-4'>
          Status : Active
        </div>
        <div className='col-md-4'>
          Actions : All
        </div>
      </div>
    ),
    showExpandColumn: true,
    expandByColumnOnly: true
  };

  actionFormater = (cell, row, rowIndex, { hoverIdx }) => {
    if ((hoverIdx !== null || hoverIdx !== undefined) && hoverIdx === rowIndex) {
      return (
        <div
          style={{ width: '20px', height: '20px', backgroundColor: 'orange' }}
        />
      )
    }
    return (
      <div
        style={{ width: '20px', height: '20px' }}
      />
    )
  }

  rowEvents = {
    onMouseEnter: (e, row, rowIndex) => {
      this.setState({ hoverIdx: rowIndex })
    },
    onMouseLeave: () => {
      this.setState({ hoverIdx: null })
    }
  }

  rowStyle = (row, rowIndex) => {
    row.index = rowIndex
    const style = {}
    if (rowIndex % 2 === 0) {
      style.backgroundColor = 'transparent'
    } else {
      style.backgroundColor = 'rgba(54, 163, 173, .10)'
    }
    style.borderTop = 'none'

    return style
  }

  render () {
    // const { ToggleList } = ColumnToggle
    const columns = [{
      dataField: 'id',
      text: 'Area',
      sort: true
    }, {
      dataField: 'City',
      text: 'City',
      sort: true
    }, {
      dataField: 'State',
      text: 'State',
      sort: true
    }, {
      dataField: 'PinCode',
      text: 'Pincode',
      sort: true
    }, {
      dataField: 'Latitude',
      text: 'Latitude',
      sort: true
    }, {
      dataField: 'Longitude',
      text: 'Longitude',
      sort: true
    }, {
      dataField: 'ContactPerson',
      text: 'Contact Person',
      sort: true
    }, {
      dataField: 'MobileNo',
      text: 'Mobile #',
      sort: true
    }]

    const products = [
      {
        id: 1,
        City: 'Hyderabad',
        State: 'Telangana',
        PinCode: 500000,
        Latitude: 17.4261583,
        Longitude: 78.5407412,
        ContactPerson: 'Sai',
        MobileNo: 9989315149
      },
      {
        id: 2,
        City: 'Hyderabad',
        State: 'Telangana',
        PinCode: 500000,
        Latitude: 17.4261583,
        Longitude: 78.5407412,
        ContactPerson: 'Sai',
        MobileNo: 9989315149
      }
    ]

    return (
      <div>
        <BootstrapTable
          keyField='id'
          data={products}
          columns={columns}
          noDataIndication='There is no data'
          classes='table'
          rowStyle={this.rowStyle}
          rowEvents={this.rowEvents}
          expandRow={this.expandRow}
        />
      </div>
    //   <ToolkitProvider
    //     keyField='id'
    //     data={products}
    //     columns={columns}
    //     columnToggle
    //     >
    //     {
    //         props => (
    //           <div>
    //             <ToggleList { ...props.columnToggleProps } />
    //             <hr />
    //             <BootstrapTable
    //               {...props.baseProps}
    //             />
    //           </div>
    //         )
    //     }
    //   </ToolkitProvider>
    )
  }
}
