import React, { useState } from 'react'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap'
import About from './About'

/**
 * Reactstrap navigation menu
 * @component
 * @author Ben Elan
 * @parent App
 * @child About
 */
const Navb = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  const linkStyle = {
    color: 'black',
    fontSize: '16px',
    padding: 0,
    margin: 0,
    marginLeft: -15,
    marginRight: -15,
  }

  return (
    <Navbar dark style={{ backgroundColor: '#206a5d' }} expand="md">
      <NavbarBrand href="/">
        {' '}
        <img src={`${process.env.PUBLIC_URL}/esri.png`} style={{ width: 25, height: 25 }} alt="" />
        {' '}
        Product to Queue
      </NavbarBrand>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <About buttonLabel="About" />
          </NavItem>
          <NavItem>
            <NavLink
              rel="noopener noreferrer"
              href="mailto:JMallinckrodt@esri.com?subject=Product%20App%20Feedback"
            >
              Provide Feedback
            </NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Transfer Resources
            </DropdownToggle>
            <DropdownMenu
              style={{
                top: 35, left: +8, padding: 0, margin: -2,
              }}
            >
              <DropdownItem className="highlightStyle">
                <NavLink
                  style={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://esri.lightning.force.com/lightning/r/Knowledge__kav/ka15x0000008f0KAAQ/view"
                >
                  Data Management
                </NavLink>
              </DropdownItem>
              {/* <DropdownItem divider /> */}
              <DropdownItem className="highlightStyle">
                <NavLink
                  style={linkStyle}
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://esri.lightning.force.com/lightning/r/Knowledge__kav/ka15x0000008kIXAAY/view"
                >
                  Developer Products
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Navb
