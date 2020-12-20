import React from 'react'

import api from '~base/api'
import PageComponent from './page-component'
import { BranchedPaginatedTable } from '~base/components/base-paginated-table'
import BaseFilterPanel from '~base/components/base-filters'
import BaseMultiFilter from '~base/components/base-multifilter'
import download from 'downloadjs'
import json2csv from 'json2csv'
import moment from 'moment'
import _ from 'lodash'
import classNames from 'classnames'
import qs from 'qs'

import Loader from '~base/components/spinner'
import PropTypes from 'baobab-react/prop-types'

class ListPageComponent extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      filters: {},
      exporting: false,
      selectedRows: [],
      totalItems: 0,
      loadRequest: new Date()
    }
  }

  componentWillMount() {
    super.componentWillMount()

    const search = qs.parse(location.search.slice(1))

    if (search.page) {
      search.page = parseInt(search.page, 10)
    }

    this.setState(search)

    this.context.tree.set(this.config.cursorName + window.location.pathname, {
      page: parseInt(search.page, 10) || 1,
      sort: search.sort || this.config.sortBy
    })
    this.context.tree.commit()

    const cursor = this.context.tree.select(this.config.cursorName)
    cursor.on('update', () => {
      this.setState({ totalItems: cursor.get('totalItems') })
    })
  }

  reload () {
    this.setState({
      selectedRows: [],
      loadRequest: new Date()
    })
  }

  getFilters () {}

  finishUp (data) {
    this.setState({
      className: ''
    })
  }

  showModal () {
    this.setState({
      className: ' is-active'
    })
  }

  hideModal () {
    this.setState({
      className: ''
    })
  }

  getHeader () {
    const config = this.config
    const { totalItems } = this.state
    const compiled = _.template(config.title)


    if (config.headerLayout === 'custom') {
      return <config.headerComponent
        reload={() => this.reload()}
        handleOnFilter={(data) => this.handleOnFilter(data)}
        {...this.state}
      />
    } else if (config.headerLayout === 'create') {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {compiled(this.state)} ({totalItems})
        </p>
        <div className='card-header-select'>
          <button className='button is-primary' onClick={() => this.showModal()}>
            {config.createComponentLabel}
          </button>
          <config.createComponent
            className={this.state.className}
            hideModal={() => this.hideModal()}
            finishUp={(data) => this.finishUp(data)}
            branchName={config.cursorName}
            baseUrl={config.apiUrl}
            url={config.apiUrl}
          />
        </div>
      </header>)
    } else {
      return (<header className='card-header'>
        <p className='card-header-title'>
          {compiled(this.state)} ({totalItems})
        </p>
      </header>)
    }
  }

  async handleOnFilter(filters) {
    clearTimeout(this.timer)
    const { history } = this.props

    this.timer = setTimeout(async () => {
      const search = qs.parse(location.search, {
        ignoreQueryPrefix: true
      })
      search.page = 1
      search.filters = filters
      history.push({
        search: qs.stringify(search)
      })

      this.setState({ page: 1, filters }, this.reload)
    }, 300)
  }

  handleOnCreateCampaign = async () => {
    this.setState({ creatingCampaign: true })
    const { history } = this.props
    const { state } = this
    const { filters } = state
    const config = this.config

    const cursor = this.context.tree.select(this.config.cursorName + window.location.pathname)

    const params = {
      ...filters,
      start: 0,
      limit: 0,
      sort: cursor.get('sort')
    }

    const body = await api.get(config.apiUrl, params)
    const items = body.data || []

    try {
      const { data: campaign } = await api.post('/admin/campaigns', {
        name: 'Untitled campaign',
        description: `Campaign created at ${moment().format('DD/MM/YYYY hh:mm a')}`,
        routes: items.map(item => ({
          path: config.campaign.path.replace(':uuid', item.uuid)
        })),
        metadata: {
          config,
          state,
          params
        }
      })
      history.push(`/admin/campaigns/${campaign.uuid}`)
    } catch (err) {
      console.error(err)
    }
    this.setState({ creatingCampaign: false })
  }

  async handleOnExport(data, filename) {
    this.setState({ exporting: true })
    const config = this.config
    const params = {
      start: 0,
      limit: 1000000, // ToDo: change mongoose data tables to support limit: 'all'
    }

    const body = await api.get(config.apiUrl, {
      ...this.state.filters,
      ...params,
    })

    let csvArray = []
    if (body.data.length) {
      csvArray = body.data.map((row) => this.exportFormatter(row))
    }

    const csv = json2csv.parse(csvArray)
    download(
      'data:text/csv;charset=utf-8,' + csv,
      (filename || config.name) + '.csv',
      'data:text/plain; charset=utf-8',
    )
    this.setState({ exporting: false })
  }

  onSelectChange (items) {
    this.setState({
      selectedRows: items
    })
  }

  updateTotal = (totalItems) => {
    this.setState({ totalItems })
  }

  render () {
    const config = this.config
    const filters = this.getFilters() || {}
    const { totalItems } = this.state

    if (!this.state.loaded) {
      return <Loader />
    }

    let multiFilterComponent
    if (Object.keys(filters).length && !filters.schema) {
      const [defaultInput] = Object.keys(filters)
      multiFilterComponent = (
        <BaseMultiFilter
          config={filters}
          filters={{ ...config.defaultFilters, ...this.state.filters }}
          onFilter={(data) => this.handleOnFilter(data)}
          defaultInput={defaultInput}
        />
      )
    }

    let filterComponent
    if (Object.keys(filters).length && filters.schema) {
      filterComponent = (
        <BaseFilterPanel
          schema={filters.schema}
          uiSchema={filters.uiSchema}
          filters={{ ...config.defaultFilters, ...this.state.filters }}
          export={!!this.exportFormatter}
          onFilter={(data) => this.handleOnFilter(data)}
          onExport={(data) => this.handleOnExport(data, this.state.filename)}
        />
      )
    }

    const compiled = _.template(config.title)

    const hasTopPanel = this.exportFormatter || multiFilterComponent || config.campaign
    const exportButtonClassName = classNames('button is-small is-dark', {
      'is-loading': this.state.exporting,
    })
    const createCampaignButtonClassName = classNames('button is-small is-info', {
      'is-loading': this.state.creatingCampaign,
    })

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section is-paddingless-top'>
            <h1 className='is-size-3 is-padding-top-small is-padding-bottom-small'>
              {compiled(this.state)}
            </h1>
            {hasTopPanel && (
              <div className="columns">
                <div className="column is-paddingless-bottom">
                  {multiFilterComponent}
                </div>


                {config.campaign && (
                  <div className="column is-narrow is-paddingless-bottom">
                    <button
                      disabled={!totalItems}
                      className={createCampaignButtonClassName}
                      onClick={this.handleOnCreateCampaign}
                    >
                      Create Campaign
                    </button>
                  </div>
                )}

                {this.exportFormatter && (
                  <div className="column is-paddingless-bottom is-narrow">
                    <button
                      disabled={!totalItems}
                      className={exportButtonClassName}
                      onClick={() => this.handleOnExport()}
                    >
                      Export as CSV
                    </button>
                  </div>
                )}
              </div>
            )}
            <div className='card'>
              {this.getHeader()}
              <div className='card-content'>
                <div className='columns'>
                  <div className='column'>
                    <BranchedPaginatedTable
                      loadRequest={this.state.loadRequest}
                      branchName={config.cursorName + window.location.pathname}
                      baseUrl={config.apiUrl}
                      page={this.state.page}
                      columns={this.getColumns()}
                      selectable={config.selectable}
                      sortedBy={config.sortBy || 'name'}
                      onSelectChange={(items) => this.onSelectChange(items)}
                      filters={{
                        ...config.defaultFilters,
                        ...this.state.filters,
                      }}
                      updateTotal={this.updateTotal}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {filterComponent}
      </div>
    )
  }
}

ListPageComponent.contextTypes = {
  tree: PropTypes.baobab,
}

export default ListPageComponent
