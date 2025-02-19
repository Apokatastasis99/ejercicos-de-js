import React, { Component } from 'react'
import { root } from 'baobab-react/higher-order'

import api from '~base/api'
import tree from '~core/tree'

import NavBar from '~components/navbar'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class Layout extends Component {
  constructor (props) {
    super(props)
    this.state = {
      user: {},
      loaded: false
    }
  }

  async componentWillMount () {
    const userCursor = tree.select('user')

    userCursor.on('update', ({data}) => {
      const user = data.currentData
      this.setState({user})
    })

    var me
    if (tree.get('jwt')) {
      try {
        me = await api.get('/user/me')
      } catch (err) {
        if (err.status === 401) {
          window.localStorage.removeItem('jwt')
          tree.set('jwt', null)
          tree.commit()
        }

        this.setState({loaded: true})
        return
      }

      tree.set('user', me.user)
      tree.set('loggedIn', me.loggedIn)

      const config = await api.get('/app-config')
      tree.set('config', config)

      tree.commit()
    }

    this.setState({loaded: true})
  }

  render () {
    if (!this.state.loaded) {
      return <div>Loading...</div>
    }

    return (<div>
      <NavBar />
      <ToastContainer />
      {this.props.children}
    </div>)
  }
}

export default root(tree, Layout)
