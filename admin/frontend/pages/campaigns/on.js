import React from 'react'
import { get } from 'lodash'
import RouteParser from 'route-parser'
import classNames from 'classnames'
import Icon from 'react-fontawesome'
import api from '~base/api'
import PageComponent from '~base/page-component'
import { loggedIn } from '~base/middlewares/'
import Loader from '~base/components/spinner'
import Link from '~base/router/link'

import ThesesDetail from '../theses/detail'

const CampaignTypes = {
  '/theses/:uuid': ThesesDetail
}

class OnCampaignDetail extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      completing: false,
      campaign: {}
    }
  }

  async onPageEnter () {
    await this.loadCampaign()
  }

  async loadCampaign () {
    const { uuid } = this.props.match.params
    const body = await api.get(`/admin/campaigns/${uuid}`)

    this.setState({
      loading: false,
      loaded: true,
      campaign: body.data
    })
  }

  async onComplete (currentIndex) {
    this.setState({ completing: true })
    const { campaign } = this.state

    const currentRoute = campaign.routes[currentIndex]
    currentRoute.completed = true

    // Update current route
    await api.put(`/admin/campaigns/${campaign.uuid}/routes/${currentIndex}`, currentRoute)

    // Update current route count
    const body = await api.put(`/admin/campaigns/${campaign.uuid}`, {
      currentRoute: currentIndex + 1
    })

    this.setState({
      completing: false,
      campaign: body.data
    })
  }

  render () {
    const { loaded, completing, campaign } = this.state

    if (!loaded) {
      return <Loader />
    }

    const config = get(campaign, 'metadata.config.campaign')

    // Get wrapped component based on path config
    const WrappedComponent = CampaignTypes[config.path]

    if (!WrappedComponent) {
      return (
        <div className='section has-text-centered'>
          Unsupported campaign type: <span className='tag has-text-danger'>{config.path}</span>
        </div>
      )
    }

    // Get next item to work which is not marked as completed
    const current = campaign.routes.find(campaign => !campaign.completed) || {}
    const currentIndex = campaign.routes.findIndex(route => route.path === current.path)

    // Create router parser and get matches from pattern
    const routeParser = new RouteParser(config.path)
    const routeParams = routeParser.match(current.path)

    // Fake match object like react-router is sending
    const match = {
      params: routeParams
    }

    const completedClassNameButton = classNames('button is-small is-light is-rounded', {
      'is-loading': completing
    })

    return (
      <div className='campaign–wrapper'>
        <section className='campaign-wrapper__details has-background-success'>
          <div className='columns is-vcentered is-mobile is-marginless'>
            <div className='column'>
              <Link className='has-text-dark has-text-weight-bold' to='/campaigns'>
                Campaigns
              </Link>
              <span> › </span>
              <Link className='has-text-dark' to={`/campaigns/${campaign.uuid}`}>
                {campaign.name}
              </Link>
            </div>
            <div className='column is-narrow'>
              {currentIndex + 1} of {campaign.totalRoutes}
            </div>
            <div className='column is-narrow'>
              <div className='buttons'>
                <button
                  type='button'
                  className={completedClassNameButton}
                  onClick={() => this.onComplete(currentIndex)}
                >
                  Complete
                </button>

                <Link
                  to='/campaigns'
                  type='button'
                  className='button is-small is-dark is-rounded'
                >
                  Exit
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className='campaign-wrapper__wrapped-page'>
          <WrappedComponent match={match} />
        </div>
      </div>
    )
  }
}

OnCampaignDetail.config({
  name: 'on-campaign-details',
  path: '/campaigns/:uuid/on',
  title: '<%= campaign.name %> | On Campaign',
  exact: true,
  validate: loggedIn
})

export default OnCampaignDetail
