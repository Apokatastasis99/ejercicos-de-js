import React, { Component } from 'react'
import Page from '~base/page'
import Loader from '~base/components/spinner'
import api from '~base/api'
import ConceptMap from '~components/base-vis/concept-map'
import classNames from 'classnames'
import Stats from '~components/Stats'

export default Page({
  path: '/herramienta',
  title: 'Herramienta',
  exact: true,
  component: class extends Component {
    constructor () {
      super(...arguments)

      this.state = {
        loading: true,
        loaded: false,
        currentDataset: 'keywords',
        datasets: {
          concepts: {
            keywords: [],
            advisors: []
          }
        },
        filters: {
          fromYear: '',
          toYear: ''
        }
      }
    }

    componentWillMount () {
      this.load()
    }

    async load () {
      const filters = { ...this.state.filters }
      if (filters.toYear < filters.fromYear) {
        filters.toYear = ''
      }

      try {
        const concepts = await api.get('/datasets/concept-map', filters)

        this.setState({
          loading: false,
          loaded: true,
          datasets: {
            concepts: {
              advisors: concepts.advisors,
              keywords: concepts.keywords
            }
          }
        })
      } catch (e) {
        this.setState({
          loading: false,
          loaded: true,
          errorMessage: e.message
        })
      }
    }

    handleDataset (dataset) {
      this.setState({ currentDataset: dataset })
    }

    handleFilters (data) {
      this.setState({
        filters: { ...this.state.filters, ...data }
      }, this.load)
    }

    getYearOptions (from, to) {
      from = from || 1900
      to = to || 2018

      const options = []
      for (let i = to; i >= from; i--) {
        options.push(<option key={from + to + i}>{i}</option>)
      }

      return options
    }

    render () {
      const {
        loading,
        currentDataset,
        datasets
      } = this.state

      if (loading) return <Loader />

      const dataset = datasets.concepts[currentDataset]

      const classNameLinkAdvisors = classNames('button is-black is-small is-uppercase is-fullwidth', {
        'is-outlined': currentDataset !== 'advisors'
      })

      const classNameLinkKeywords = classNames('button is-black is-small is-uppercase is-fullwidth', {
        'is-outlined': currentDataset !== 'keywords'
      })

      return (
        <section className='section'>
          <div className='containers'>
            <div className='columns'>
              <div className='column is-2' style={{width: 200}}>
                <div className='field'>
                  <div className='control'>
                    <label className='label'>Desde</label>
                    <div className='select is-rounded is-fullwidth'>
                      <select
                        onChange={(e) => this.handleFilters({ fromYear: e.target.value })}
                        value={this.state.filters.fromYear}
                      >
                        <option value=''>Seleccionar año</option>
                        {this.getYearOptions()}
                      </select>
                    </div>
                  </div>
                </div>

                <div className='field'>
                  <div className='control'>
                    <label className='label'>Hasta</label>
                    <div className='select is-rounded is-fullwidth'>
                      <select
                        onChange={(e) => this.handleFilters({ toYear: e.target.value })}
                        value={this.state.filters.toYear}
                      >
                        <option value=''>Seleccionar año</option>
                        {this.getYearOptions(this.state.filters.fromYear)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className='field'>
                  <div className='control'>
                    <label className='label'>Ordenar</label>
                    <div className='field'>
                      <button type='button' className={classNameLinkAdvisors} onClick={() => this.handleDataset('advisors')}>Por asesores</button>
                    </div>
                    <div className='field'>
                      <button type='button' className={classNameLinkKeywords} onClick={() => this.handleDataset('keywords')}>Por conceptos</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className='column'>
                <ConceptMap dataset={dataset} />
              </div>
            </div>

            <Stats />
          </div>
        </section>
      )
    }
  }
})
