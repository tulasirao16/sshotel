/**
 * Copyright (C) NextGen Technology Solutions, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Hari <hari@ngstek.com>, Mar 2019
 */

import { saveLocale } from './i18nInit'
import React, { Component } from 'react'
// import GithubRibbon from './GithubRibbon'
import { t } from 'ttag'
// import { t, jt } from 'ttag'

// import logo from './logo.svg';
import './App.css'

const setLocale = (locale) => (ev) => {
  ev.preventDefault()
  saveLocale(locale)
  window.location.reload()
}

const LangSwitcher = () => (
  <div className='Lang-switch'>
    {/* <h2>{ t`Switch lang`}</h2> */}
    <a href='/' onClick={setLocale('en')}>en</a>
    <a href='/' onClick={setLocale('te')}>te</a>
    <a href='/' onClick={setLocale('hn')}>hn</a>
  </div>
)

class Language extends Component {
  render () {
    // const appLink = <code>src/App.js</code>
    return (
      <div className='App'>
        <header className='App-header'>
          <LangSwitcher />
          {/* <img src={logo} className='App-logo' alt='logo' /> */}
          {/* <p>
            { jt`Edit ${appLink} and save to reload.` }
          </p> */}
          {/* { t`Learn React` } */}
          {t`Welcome to Multi language app`}
          {/* { t`Learn ttag` } */}
        </header>
        {/* <GithubRibbon /> */}
      </div>
    )
  }
}

export default Language
