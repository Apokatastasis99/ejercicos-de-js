import React, { useState, useEffect } from 'react'
import api from '~base/api'
import Loader from '~base/components/spinner'

const Stats = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentStats, setCurrentStats] = useState({
    thesesCount: 0,
    thesesFirstDegreeCount: 0,
    thesesSecondDegreeCount: 0,
    thesesThirdDegreeCount: 0,
    thesesAuthorsCount: 0,
    thesesAdvisorsCount: 0
  })

  const getStats = async () => {
    const stats = await api.get('/theses/stats')
    setCurrentStats({
      ...currentStats,
      ...stats
    })
    setIsLoading(false);
  }

  useEffect(() => {
    getStats()
  }, [])

  if (isLoading) return <Loader />

  return (
    <div>
      <hr />

      <div className='section'>
        <nav className='level has-text-grey'>
          <div className='level-item has-text-centered'>
            <div>
              <p className='title is-4 has-text-grey-dark'>{currentStats.thesesCount}</p>
              <p className='heading'>Tesis</p>
            </div>
          </div>
          <div className='level-item has-text-centered'>
            <div>
              <p className='title is-4 has-text-grey-dark'>{currentStats.thesesFirstDegreeCount}</p>
              <p className='heading'>Licenciatura</p>
            </div>
          </div>
          <div className='level-item has-text-centered'>
            <div>
              <p className='title is-4 has-text-grey-dark'>{currentStats.thesesSecondDegreeCount}</p>
              <p className='heading'>Maestría</p>
            </div>
          </div>
          <div className='level-item has-text-centered'>
            <div>
              <p className='title is-4 has-text-grey-dark'>{currentStats.thesesThirdDegreeCount}</p>
              <p className='heading'>Doctorado</p>
            </div>
          </div>
          <div className='level-item has-text-centered'>
            <div>
              <p className='title is-4 has-text-grey-dark'>{currentStats.thesesAuthorsCount}</p>
              <p className='heading'>Autores</p>
            </div>
          </div>
          <div className='level-item has-text-centered'>
            <div>
              <p className='title is-4 has-text-grey-dark'>{currentStats.thesesAdvisorsCount}</p>
              <p className='heading'>Asesores</p>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default Stats
