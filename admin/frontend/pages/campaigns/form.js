import React, { Component } from 'react'

import api from '~base/api'

import {
  BaseForm,
  TextWidget
} from '~base/components/base-form'

const schema = {
  type: 'object',
  title: '',
  required: [
    'name',
    'description'
  ],
  properties: {
    name: {type: 'string', title: 'Name'},
    description: {type: 'string', title: 'Description'},
    currentRoute: {type: 'number', title: 'Current'},
    totalRoutes: {type: 'number', title: 'Size'}
  }
}

const uiSchema = {
  name: {'ui:widget': TextWidget},
  description: {'ui:widget': TextWidget},
  currentRoute: {'ui:widget': TextWidget, 'ui:disabled': true},
  totalRoutes: {'ui:widget': TextWidget, 'ui:disabled': true}
}

class CampaignForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: this.props.initialState,
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden'
    }
  }

  errorHandler (e) {}

  changeHandler ({formData}) {
    this.setState({
      formData,
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden'
    })
  }

  clearState () {
    this.setState({
      apiCallMessage: 'is-hidden',
      apiCallErrorMessage: 'is-hidden',
      formData: this.props.initialState
    })
  }

  async submitHandler ({ formData }) {
    const params = {
      uuid: formData.uuid,
      name: formData.name,
      description: formData.description
    }

    try {
      let data
      if (params.uuid) {
        data = await api.put(this.props.url, params)
      } else {
        data = await api.post(this.props.url, params)
      }
      await this.props.load()
      this.clearState()
      this.setState({ apiCallMessage: 'message is-success' })
      
      if (this.props.finishUp) {
        this.props.finishUp(data.data)
      }
      return
    } catch (e) {
      return this.setState({
        error: e.message,
        apiCallErrorMessage: 'message is-danger'
      })
    }
  }

  render () {
    var error
    if (this.state.error) {
      error = <div>
        Error: {this.state.error}
      </div>
    }

    return (
      <BaseForm schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        onChange={(e) => { this.changeHandler(e) }}
        onSubmit={(e) => { this.submitHandler(e) }}
        onError={(e) => { this.errorHandler(e) }}
      >
        <div className={this.state.apiCallMessage}>
          <div className='message-body is-size-7 has-text-centered'>
            All changes have been saved
          </div>
        </div>

        <div className={this.state.apiCallErrorMessage}>
          <div className='message-body is-size-7 has-text-centered'>
            {error}
          </div>
        </div>
        {this.props.children}
      </BaseForm>
    )
  }
}

export default CampaignForm
