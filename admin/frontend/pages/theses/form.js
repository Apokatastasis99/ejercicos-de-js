import React, { Component } from 'react'

import api from '~base/api'

import {
  BaseForm,
  TextWidget,
  SelectWidget
} from '~base/components/base-form'

const schema = {
  type: 'object',
  title: '',
  required: [
  ],
  properties: {
    year: {type: 'number', title: 'Year'},
    author: {type: 'string', title: 'Author'},
    gender: {
      type: 'string',
      title: 'Gender',
      enum: ['female', 'male'],
      enumNames: ['Female', 'Male']
    },
    title: {type: 'string', title: 'Title'},
    advisor: {type: 'string', title: 'Advisor'},
    advisor2: {type: 'string', title: 'Advisor 2'},
    college: {type: 'string', title: 'College'},
    institution: {type: 'string', title: 'Institution'},
    degree: {type: 'string', title: 'Degree'}
  }
}

const uiSchema = {
  year: {'ui:widget': TextWidget},
  title: {'ui:widget': TextWidget},
  author: {'ui:widget': TextWidget},
  gender: {'ui:widget': SelectWidget},
  advisor: {'ui:widget': TextWidget},
  advisor2: {'ui:widget': TextWidget},
  college: {'ui:widget': TextWidget},
  institution: {'ui:widget': TextWidget},
  degree: {'ui:widget': TextWidget}
}

class ThesisForm extends Component {
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

  async submitHandler ({formData}) {
    try {
      var data
      if (formData.uuid) {
        data = await api.put(this.props.url, formData)
      } else {
        data = await api.post(this.props.url, formData)
      }
      await this.props.load()
      this.clearState()
      this.setState({ apiCallMessage: 'message is-success' })
      if (this.props.finishUp) this.props.finishUp(data.data)
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
      <div>
        <BaseForm schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          onChange={(e) => { this.changeHandler(e) }}
          onSubmit={(e) => { this.submitHandler(e) }}
          onError={(e) => { this.errorHandler(e) }}
        >
          <div className={this.state.apiCallMessage}>
            <div className='message-body is-size-7 has-text-centered'>
              Los datos se han guardado correctamente
            </div>
          </div>

          <div className={this.state.apiCallErrorMessage}>
            <div className='message-body is-size-7 has-text-centered'>
              {error}
            </div>
          </div>
          {this.props.children}
        </BaseForm>
      </div>
    )
  }
}

export default ThesisForm
