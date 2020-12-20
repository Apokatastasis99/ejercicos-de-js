import React, { Component } from 'react'
import api from '~base/api'
// import moment from 'moment'

import PageComponent from '~base/page-component'
import {loggedIn} from '~base/middlewares/'
import Loader from '~base/components/spinner'
import ReactJson from 'react-json-view'
import ThesisForm from './form'
import ThesisHistory from './components/ThesisHistory'

class ThesisDetail extends PageComponent {
  constructor (props) {
    super(props)

    this.state = {
      ...this.baseState,
      thesis: {}
    }
  }

  async onPageEnter () {
    await this.loadThesis()
  }

  async loadThesis () {
    const { uuid } = this.props.match.params
    const body = await api.get(`/admin/theses/${uuid}`)

    this.setState({
      loading: false,
      loaded: true,
      thesis: body.data
    })
  }

  render () {
    const { loaded, thesis } = this.state

    if (!loaded) {
      return <Loader />
    }

    const keywords = thesis.keywords.map(keyword => <span className='tag is-rounded is-bordered' key={'tag-' + keyword}>{keyword}</span>)
    const { file, fields } = thesis.rawData
    fields['Texto Completo'] = file

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
                          Thesis
                        </p>
                      </header>
                      <div className='card-content'>
                        <div className='columns'>
                          <div className='column'>
                            <ThesisForm
                              url={'/admin/theses/' + thesis.uuid}
                              initialState={thesis}
                              load={(data) => this.loadThesis(data)}
                            >
                              <div className='field is-grouped'>
                                <div className='control'>
                                  <button className='button is-primary'>Save</button>
                                </div>
                              </div>
                            </ThesisForm>
                            <table className='is-hidden table is-fullwidth is-narrow is-striped is-nowrapped'>
                              <tbody>
                                <tr>
                                  <td>Year</td>
                                  <td>{thesis.year}</td>
                                </tr>
                                <tr>
                                  <td>Title</td>
                                  <td>{thesis.title}</td>
                                </tr>
                                <tr>
                                  <td>Author</td>
                                  <td>{thesis.author}</td>
                                </tr>
                                <tr>
                                  <td>Advisor</td>
                                  <td>{thesis.advisor}</td>
                                </tr>
                                <tr>
                                  <td>Second Advisor</td>
                                  <td>{thesis.advisor2}</td>
                                </tr>
                                <tr>
                                  <td>College</td>
                                  <td>{thesis.college}</td>
                                </tr>
                                <tr>
                                  <td>Institution</td>
                                  <td>{thesis.institution}</td>
                                </tr>
                                <tr>
                                  <td>Degree</td>
                                  <td>{thesis.degree}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='column'>
                <div className='columns'>
                  <div className='column'>
                    <div className='card'>
                      <header className='card-header'>
                        <p className='card-header-title'>
                          Word Tokens
                        </p>
                      </header>
                      <div className='card-content'>
                        <div className='tags'>{keywords}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='columns'>
                  <div className='column'>
                    <ThesisHistory thesis={thesis} />
                  </div>
                </div>
              </div>
            </div>
            <div className='columns'>
              <div className='column'>
                <div className='card'>
                  <header className='card-header'>
                    <p className='card-header-title'>
                      Raw Data
                    </p>
                  </header>
                  <div className='card-content'>
                    <ReactJson
                      src={fields}
                      name={false}
                      displayDataTypes={false}
                      enableClipboard={false}
                      style={{ fontSize: '12px' }}
                      iconStyle='square'
                    />
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

ThesisDetail.config({
  name: 'theses-details',
  path: '/theses/:uuid',
  title: '<%= thesis.title %> | User details',
  breadcrumbs: [
    {label: 'Dashboard', path: '/'},
    {label: 'Theses', path: '/theses'},
    {label: '<%= thesis.title %>'}
  ],
  exact: true,
  validate: loggedIn
})

export default ThesisDetail
