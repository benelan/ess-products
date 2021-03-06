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
      <NavbarBrand style={{ cursor: 'default' }}>
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
                  href="https://esri.lightning.force.com/lightning/r/Knowledge__kav/ka15x000000HbQYAA0/view"
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
                  href="https://esri.lightning.force.com/lightning/r/Knowledge__kav/ka15x000000HdbxAAC/view"
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
