import React, { useState, useEffect } from 'react'
import moment from 'moment'
import api from '~base/api'
import Loader from '~base/components/spinner'
import { BaseTable } from '~base/components/base-table'

function ThesisHistory({ thesis }) {
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  const { uuid } = thesis;

  async function getHistory () {
    setLoading(true)
    const { data } = await api.get(`/admin/theses/${uuid}/history`)
    setHistory(data)
    setLoading(false)
  }

  useEffect(() => {
    getHistory()
  }, [thesis])

  let content

  if (loading) {
    content = <Loader />
  }

  const columns = [
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
              className='tag is-light is-rounded is-bordered is-size-7'
              key={row.uuid + '_' + d}
            >{d}</div>)
          }
        </div>
      }
    },
    {
      title: 'Created',
      property: 'timestamp',
      formatter: row => {
        return (
          moment.utc(row.timestamp).local().format('DD/MM/YYYY hh:mm a')
        )
      }
    }
  ]

  content = (
    <BaseTable
      data={history}
      columns={columns}
      className='table is-striped is-hoverable is-fullwidth is-size-7'
    />
  )

  return (
    <div className='card'>
      <header className='card-header'>
        <p className='card-header-title'>
          Change Log
        </p>
      </header>
      <div className='card-content is-paddingless'>
        {content}
      </div>
    </div>
  )
}

export default ThesisHistory;
