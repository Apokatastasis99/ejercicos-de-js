import React from 'react'
import api from '~base/api'
import Link from '~base/router/link'
import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import Loader from '~base/components/spinner'
import CampaignForm from './form'

class CampaignDetail extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
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

  render () {
    const { loaded, campaign } = this.state

    if (!loaded) {
      return <Loader />
    }

    return (
      <div className='columns c-flex-1 is-marginless'>
        <div className='column is-paddingless'>
          <div className='section'>
            <div className='columns'>
              <div className='column'>
                {this.getBreadcrumbs()}
              </div>
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='columns'>
                  <div className='column'>
                    <div className='card'>
                      <header className='card-header'>
                        <p className='card-header-title'>
                          Campaign
                        </p>
                      </header>
                      <div className='card-content'>
                        <div className='columns'>
                          <div className='column'>
                            <CampaignForm
                              url={`/admin/campaigns/${campaign.uuid}`}
                              initialState={campaign}
                              load={(data) => this.loadCampaign(data)}
                            >
                              <div className='field is-grouped'>
                                <div className='control'>
                                  <button className='button is-primary'>Save</button>
                                </div>
                              </div>
                            </CampaignForm>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='column'>
                <div className='card'>
                  <div className='card-content'>
                    <Link
                      className="button is-success"
                      to={`/campaigns/${campaign.uuid}/on`}
                    >
                      Start Campaign
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CampaignDetail.config({
  name: 'campaign-details',
  path: '/campaigns/:uuid',
  title: '<%= campaign.name %> | Campaign details',
  breadcrumbs: [
    { label: 'Dashboard', path: '/' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: '<%= campaign.name %>' }
  ],
  exact: true,
  validate: loggedIn
})

export default CampaignDetail
