import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'

import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares'

class HistoryList extends ListPageComponent {
  getColumns () {
    return [
      {
        title: 'Collection',
        property: 'collectionName',
        default: 'N/A'
      },
      {
        title: 'Event',
        property: 'event',
        default: 'N/A'
      },
      {
        title: 'User',
        property: 'user',
        default: 'N/A',
        formatter: row => {
          return row.user.screenName || row.user.displayName
        }
      },
      {
        title: 'Target',
        property: 'diff',
        default: 'N/A',
        formatter: row => {
          return <div className='tags' style={{maxWidth: 250}}>
            {Object.keys(row.diff).map(d => 
              <div
                className='tag is-light is-rounded is-bordered'
                key={row.uuid + '_' + d}
              >{d}</div>)
            }
          </div>
        }
      },
      {
        title: 'Created',
        property: 'timestamp',
        sortable: true,
        formatter: row => {
          return (
            moment.utc(row.timestamp).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        title: 'Actions',
        formatter: row => {
          const { data } = row
          if (data) {
            let url

            if (row.collectionName === 'Thesis') {
              url = '/theses/' + data.uuid
            }

            if (url) {
              return <Link className='button is-small is-link' to={url}>{row.collectionName} Details</Link>
            }
          }
        }
      }
    ]
  }

  exportFormatter({
    collectionName,
    event,
    user,
    diff,
    timestamp
  }) {
    const target = Object.keys(diff).map(value => value)

    return {
      collectionName,
      event,
      user: user.screenName || user.displayName,
      target: target.join(', '),
      timestamp
    }
  }
}

HistoryList.config({
  name: 'history-list',
  path: '/history',
  title: 'History',
  icon: 'history',
  exact: true,
  validate: loggedIn,
  sortBy: '-timestamp',
  apiUrl: '/admin/histories'
})

export default HistoryList
