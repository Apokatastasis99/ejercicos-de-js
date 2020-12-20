import React from 'react'
import api from '~base/api'
import Link from '~base/router/link'
import moment from 'moment'
import { get } from 'lodash'

import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares'
import ConfirmButton from '~base/components/confirm-button'

class CampaignList extends ListPageComponent {
  async deleteCampaign ({ uuid }) {
    await api.del(`/admin/campaigns/${uuid}`)
    this.reload()
  }

  getColumns () {
    return [
      {
        title: 'Name',
        property: 'name',
        sortable: true
      },
      {
        title: 'Description',
        property: 'description',
        sortable: true
      },
      {
        title: 'Progress',
        formatter: campaign => {
          const routes = get(campaign, 'routes', [])
          const completed = routes.filter(route => route.completed)
          const progress = parseInt(completed.length * 100 / routes.length, 0)

          return `${Math.ceil(progress)}%`
        }
      },
      {
        title: 'Author',
        property: 'author',
        formatter: campaign => {
          const name = get(campaign, 'author.name')
          const displayName = get(campaign, 'author.displayName')
          const screenName = get(campaign, 'author.screenName')
          return name || displayName || screenName
        }
      },
      {
        title: 'Created',
        property: 'createdAt',
        sortable: true,
        formatter: campaign => {
          return (
            moment.utc(campaign.createdAt).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        title: 'Actions',
        formatter: campaign => {
          return (
            <div className='field is-grouped'>
              <div className='control'>
                <Link className='button is-small is-success' to={`/campaigns/${campaign.uuid}/on`}>
                  Start
                </Link>
              </div>

              <div className='control'>
                <Link className='button is-small is-link' to={`/campaigns/${campaign.uuid}`}>
                  Details
                </Link>
              </div>

              <div className='control'>
                <ConfirmButton
                  title='Delete campaign'
                  onConfirm={() => this.deleteCampaign(campaign)}
                  className='button is-small is-danger'
                  message={(
                    <div>
                      ¿Estás seguro de eliminar campaña <strong>{campaign.name}</strong>?
                    </div>
                  )}
                >
                  Delete
                </ConfirmButton>
              </div>
            </div>
          )
        }
      }
    ]
  }
}

CampaignList.config({
  name: 'campaigns-list',
  path: '/campaigns',
  title: 'Campaigns',
  icon: 'tasks',
  exact: true,
  validate: loggedIn,
  apiUrl: '/admin/campaigns'
})

export default CampaignList
