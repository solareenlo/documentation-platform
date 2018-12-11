import React from 'react'
import styled, { css } from 'styled-components'
import logo from './../../assets/Logo.svg'
import Menu from './Menu'

const menuHidden = {
  position: 'fixed',
  zIndex: 2,
  right: '-311px',
  top: 0,
  transition: '500ms ease'
}
const menuShown = {
  position: 'fixed',
  zIndex: 2,
  right: 0,
  top: 0,
  transition: '500ms ease'
}

class Header extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isMenuOpen: false
    }
    this.handleBurgerClick = this.handleBurgerClick.bind(this)
  }

  handleBurgerClick(e) {
    this.setState((prevState, prevProps) => ({
      isMenuOpen: !prevState.isMenuOpen
    }));
  }

  render() {
    return (<header className="header ">
      <div className="top-header">
        <ul className="top-header__items">
          {this.props.topTitles.map((topTitle, index) =>
            (<li key={index} className="top-header__item">
              <a href={topTitle.href}>{topTitle.text.toUpperCase()}</a>
            </li>)
          )}
        </ul>
      </div>
      <div className="header__wrapper">
        <section className="header__head">
          <img className="header__brand" src={logo} />
          <button className="header__icon" onClick={this.handleBurgerClick}>
            <i className="fas fa-bars fa-2x"></i>
          </button>
          <Menu
            data={this.props.data}
            onCloseClick={this.handleBurgerClick}
            styles={this.state.isMenuOpen ? menuShown : menuHidden} />
        </section>
        <section className="header__body" style={{}}>
          <span className="text text--level1 text--secondary">{this.props.headerTitle}</span>
          <div className="header__search">
            <div className="input-wrapper">
              <input type="text" className="input-search" placeholder="Search for topics" />
            </div>
          </div>
        </section>
      </div>
    </header>)
  }
}
export default Header
