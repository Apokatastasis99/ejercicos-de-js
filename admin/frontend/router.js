import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import AdminLayout from '~components/admin-layout'

import LogIn from './pages/log-in'
import Dashboard from './pages/dashboard'
import ResetPassword from './pages/reset-password'
import EmailResetLanding from './pages/emails/reset'
import Users from './pages/users/list'
import UserDetail from './pages/users/detail'
import DeletedUsers from './pages/users/list-deleted'
import UsersImport from './pages/users/import'
import Profile from './pages/profile'
import Organizations from './pages/organizations/list'
import OrganizationDetail from './pages/organizations/detail'
import Roles from './pages/roles/list'
import RoleDetail from './pages/roles/detail'
import Groups from './pages/groups/list'
import GroupDetail from './pages/groups/detail'
import RequestLogs from './pages/request-logs/list'

import Theses from './pages/theses/list'
import ThesisDetail from './pages/theses/detail'
import Histories from './pages/histories/list'
import Campaigns from './pages/campaigns/list'
import CampaignDetail from './pages/campaigns/detail'
import OnCampaign from './pages/campaigns/on'
import AppConfig from './pages/developer-tools/app-config'
// #Import

const NoMatch = () => {
  return <div>Not Found</div>
}

const AppRouter = () => {
  return (<Router>
    <AdminLayout>
      <div className='c-flex-1 is-flex is-flex-column is-relative'>
        <Switch>
          {LogIn.asRouterItem()}
          {ResetPassword.asRouterItem()}
          {EmailResetLanding.asRouterItem()}
          {Dashboard.asRouterItem()}
          {Profile.asRouterItem()}

          {Users.asRouterItem()}
          {DeletedUsers.asRouterItem()}
          {UserDetail.asRouterItem()}
          {UsersImport.asRouterItem()}

          {Organizations.asRouterItem()}
          {OrganizationDetail.asRouterItem()}

          {Roles.asRouterItem()}
          {RoleDetail.asRouterItem()}

          {Groups.asRouterItem()}
          {GroupDetail.asRouterItem()}

          {RequestLogs.asRouterItem()}
          {AppConfig.asRouterItem()}

          {Theses.asRouterItem()}
          {ThesisDetail.asRouterItem()}

          {Histories.asRouterItem()}
          
          {Campaigns.asRouterItem()}
          {CampaignDetail.asRouterItem()}
          {OnCampaign.asRouterItem()}
          <div id='route' />
          <Route component={NoMatch} />
        </Switch>
      </div>
    </AdminLayout>
  </Router>)
}

export default AppRouter
