import React, { Component } from 'react'
import { NavLink } from '~base/router'
import { branch } from 'baobab-react/higher-order'
import { withRouter } from 'react-router'

import api from '~base/api'
import tree from '~core/tree'

import env from '~base/env-variables'

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mobileMenu: 'close',
      redirect: false,
      profileDropdown: 'is-hidden',
      dropCaret: 'fa fa-angle-down'
    }

    this.setWrapperRef = this.setWrapperRef.bind(this)
    this.handleClickOutside = this.handleClickOutside.bind(this)
  }

  componentDidMount () {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount () {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  setWrapperRef (node) {
    this.wrapperRef = node
  }

  handleClickOutside (event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ 'profileDropdown': 'is-hidden', 'dropCaret': 'fa fa-angle-down' })
    }
  }

  toggleBtnClass () {
    if (this.wrapperRef) {
      if (this.state.profileDropdown === 'is-hidden') {
        this.setState({ 'profileDropdown': 'is-active', 'dropCaret': 'fa fa-angle-up' })
      } else {
        this.setState({ 'profileDropdown': 'is-hidden', 'dropCaret': 'fa fa-angle-down' })
      }
    }
  }

  async handleLogout () {
    const {history} = this.props

    try {
      await api.del('/user')
    } catch (err) {
      console.log('Error removing token, logging out anyway ...')
    }

    window.localStorage.removeItem('jwt')
    tree.set('jwt', null)
    tree.set('user', null)
    tree.set('loggedIn', false)
    tree.commit()

    history.push('/')
  }

  handleNavbarBurgerClick () {
    if (this.state.mobileMenu === 'open') {
      this.setState({mobileMenu: 'close'})
    } else {
      this.setState({mobileMenu: 'open'})
    }
  }

  render () {
    var navbarMenuClassName = 'navbar-menu'
    if (this.state.mobileMenu === 'open') {
      navbarMenuClassName = 'navbar-menu is-active'
    }

    var navButtons
    let username
    if (this.props.loggedIn) {
      if (tree.get('user')) {
        username = tree.get('user').displayName || tree.get('user').screenName
      }

      navButtons = (<div className='navbar-end'>
        <div className='dropdown is-active is-right' ref={this.setWrapperRef}>
          <div className='dropdown-trigger is-flex'>
            <a href='javascript:undefined' className='navbar-item' onClick={() => this.toggleBtnClass()}>
              <span className='is-size-7 is-capitalized'>
                Hola { username }
              </span>
              <span className='icon'>
                <i className={this.state.dropCaret} />
              </span>
            </a>
          </div>
          <div className={this.state.profileDropdown}>
            <div className='dropdown-menu' id='dropdown-menu' role='menu'>
              <div className='dropdown-content'>
                <a className='dropdown-item' href={`${env.ADMIN_HOST}${env.ADMIN_PREFIX}`}>Administrar</a>
                <a className='dropdown-item' onClick={() => this.handleLogout()}>
                  Salir
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>)
    } else {
      navButtons = (<div className='navbar-end'>
        <div className='navbar-item'>
          <div className='field is-grouped'>
            <p className='control'>
              <a className='button' href={`${env.ADMIN_HOST}${env.ADMIN_PREFIX}`}>Acceder</a>
            </p>
          </div>
        </div>
      </div>)
    }

    return (
      <nav className='navbar is-fixed-top'>
        <div className='container is-fluid'>
          <div className='navbar-brand'>
            <NavLink className='navbar-item' to='/'>
              <h1>Tesis de filosofía</h1>
            </NavLink>

            <div className='navbar-burger burger' onClick={(e) => this.handleNavbarBurgerClick(e)}>
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={navbarMenuClassName}>
            <div className='navbar-start'>
              <NavLink exact className='navbar-item' to='/'>
                Acerca
              </NavLink>
              <NavLink exact className='navbar-item' to='/herramienta'>
                Herramienta
              </NavLink>
            </div>
            {navButtons}
          </div>
        </div>
      </nav>
    )
  }
}

export default withRouter(branch({
  loggedIn: 'loggedIn'
}, NavBar))
