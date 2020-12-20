import React from 'react'
import Link from '~base/router/link'
import moment from 'moment'
import qs from 'qs'

import ListPageComponent from '~base/list-page-component'
import { loggedIn } from '~base/middlewares'

const getRange = (start, stop, step = -1) => Array.from({
  length: (stop - start) / step + 1
}, (value, i) => start + (i * step));

class ThesisList extends ListPageComponent {
  getColumns () {
    return [
      {
        title: 'Year',
        property: 'year',
        default: 'N/A',
        sortable: true
      },
      {
        title: 'Title',
        property: 'title',
        default: 'N/A',
        sortable: true
      },
      {
        title: 'Author',
        property: 'author',
        default: 'N/A',
        sortable: true
      },
      {
        title: 'Advisor',
        property: 'advisor',
        default: 'N/A',
        sortable: true
      },
      {
        title: 'Degree',
        property: 'degree',
        default: 'N/A'
      },
      {
        title: 'Updated',
        property: 'updatedAt',
        sortable: true,
        formatter: row => {
          return (
            moment.utc(row.updatedAt).local().format('DD/MM/YYYY hh:mm a')
          )
        }
      },
      {
        title: 'Actions',
        formatter: thesis => {
          return <Link className='button is-small is-link' to={`/theses/${thesis.uuid}`}>
            Details
          </Link>
        }
      }
    ]
  }

  getFilters () {
    const schema = {
      search: {
        label: 'Full Search',
        widget: 'TextWidget',
        placeholder: 'Enter your criteria',
      },
      year: {
        label: 'Year',
        widget: 'SelectWidget',
        placeholder: 'Select a year',
      }
    }

    const currentYear = (new Date()).getFullYear();
    schema.year.options = getRange(currentYear, 1900)
    schema.year.options = schema.year.options.map(year => ({ label: year, value: year}))

    return schema
  }

  exportFormatter({
    year,
    degree,
    title,
    author,
    gender,
    advisor,
    advisor2,
    updatedAt
  }) {
    return {
      year,
      degree,
      title,
      author,
      gender,
      advisor,
      advisor2,
      updatedAt
    }
  }
}

ThesisList.config({
  name: 'theses-list',
  path: '/theses',
  campaign: {
    path: '/theses/:uuid'
  },
  title: 'Theses',
  icon: 'book',
  exact: true,
  validate: loggedIn,
  sortBy: '-year',
  apiUrl: '/admin/theses'
})

export default ThesisList
