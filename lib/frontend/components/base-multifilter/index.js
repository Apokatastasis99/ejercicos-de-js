import React, { Component } from 'react'
import MarbleForm from '~base/components/marble-form'
import moment from 'moment'
import classNames from 'classnames'
import './multifilter.scss'

class BaseMultiFilterPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      currentWidget: props.config[props.defaultInput] || {},
      showFilterTypes: false,
      defaultFilters: props.filters,
      formData: props.filters,
    }

    if (props.defaultInput && props.config[props.defaultInput]) {
      this.state.currentWidget = {
        [props.defaultInput]: props.config[props.defaultInput],
      }
    }
  }

  componentWillReceiveProps(props) {
    const filters = 'filters' in props ? props.filters : this.props.filters

    if (JSON.stringify(filters) !== JSON.stringify(this.state.defaultFilters)) {
      this.setState({
        defaultFilters: filters,
        formData: filters,
      })
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', (e) => this.handleClickOutside(e))
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', (e) => this.handleClickOutside(e))
  }

  handleClickOutside(e) {
    const { dropdown } = this.refs
    if (dropdown && !dropdown.contains(e.target)) {
      this.setState({ showFilterTypes: false })
    }
  }

  async handleOnChange(formData) {
    this.setState({ loading: true })
    let newFormData = {}

    Object.keys(formData).forEach((key) => {
      if (formData[key] || typeof formData[key] === 'number') {
        newFormData[key] = formData[key]
      }
    })

    this.setState({
      formData: newFormData,
      showFilterTypes: false,
    })

    if (this.props.onFilter) {
      await this.props.onFilter(newFormData)
    }

    this.setState({ loading: false })
  }

  handleShowFilterTypes() {
    this.setState({
      showFilterTypes: !this.state.showFilterTypes,
    })
  }

  handleCurrentWidget(currentWidget) {
    this.setState({
      currentWidget,
      showFilterTypes: false,
    })
  }

  handleRemoveFilter(key) {
    const { formData } = this.state
    delete formData[key]
    this.handleOnChange(formData)
  }

  getTagsFromFilters() {
    const { config } = this.props
    const { formData } = this.state
    const keys = Object.keys(config)
    return keys.map((key) => {
      let widget = config[key]
      let options = widget.options || []
      let value = formData[key]
      let option = options.find((option) => option.value === value)

      if (option) {
        value = option.label || option.value
      }

      if (widget.widget === 'DateWidget' && widget.dateFormat && value) {
        value = moment(value).format(widget.dateFormat)
      }

      if (!value) return

      return (
        <div className="tags has-addons is-inline-block" key={key}>
          <span className="tag is-primary">
            <span className="has-text-weight-bold">{widget.label}</span>:{' '}
            {value}
          </span>
          <a
            className="tag button is-primary has-text-weight-normal"
            onClick={() => this.handleRemoveFilter(key)}
          >
            <i className="fa fa-close" />
          </a>
        </div>
      )
    })
  }

  render() {
    const { currentWidget, formData, loading } = this.state
    const { config } = this.props

    const className = classNames('multifilter', this.props.className)

    const selectOptionsClass = classNames('dropdown', {
      'is-active': this.state.showFilterTypes,
    })

    const iconClassName = classNames('fa', {
      'fa-angle-up': this.state.showFilterTypes,
      'fa-angle-down': !this.state.showFilterTypes,
    })

    const labelFilterDropdown = loading ? 'Filtering...' : 'Filter'

    return (
      <div className={className}>
        <div className={selectOptionsClass} ref="dropdown">
          <div className="field has-addons">
            <div className="control">
              <button
                className="button"
                onClick={() => this.handleShowFilterTypes()}
              >
                <span>{labelFilterDropdown}</span>
                <span className="icon is-small">
                  <i className={iconClassName} />
                </span>
              </button>
            </div>
            <div className="control">
              <MarbleForm
                schema={currentWidget}
                onChange={(data) => this.handleOnChange(data)}
                formData={{ ...this.state.formData }}
              >
                <div />
              </MarbleForm>
            </div>
          </div>

          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {Object.keys(config).map((key, i) => {
                let widget = config[key]
                let options = widget.options || []
                let value = formData[key]
                let option = options.find((option) => option.value === value)

                if (option) {
                  value = option.label || option.value
                }

                if (
                  widget.widget === 'DateWidget' &&
                  widget.dateFormat &&
                  value
                ) {
                  value = moment(value).format(widget.dateFormat)
                }

                return (
                  <a
                    key={i}
                    onClick={() => this.handleCurrentWidget({ [key]: widget })}
                    className="dropdown-item"
                  >
                    <span className="is-block">{config[key].label}</span>
                    <small className="is-block">{value}</small>
                  </a>
                )
              })}
            </div>
          </div>
        </div>

        <div>{this.getTagsFromFilters()}</div>
      </div>
    )
  }
}

BaseMultiFilterPanel.defaultProps = {
  defaultInput: null,
  filters: {},
}

export default BaseMultiFilterPanel
