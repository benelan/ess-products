import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, NavLink,
} from 'reactstrap'

/**
 * Provides information about the app in a reactstrap modal
 * @component
 * @author Ben Elan
 * @parent Navbar
 */
/* eslint-disable max-len */
const About = ({ buttonLabel, className }) => {
  // state for opening/closing modal
  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  return (
    <>
      <NavLink color="link" onClick={toggle} style={{ cursor: 'pointer' }}>{buttonLabel}</NavLink>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>About</ModalHeader>
        <ModalBody>
          <p>
            The Product to Queue app is a browser-based tool which helps determine the appropriate team/queue to route a case based on product names or buzzwords.
          </p>
          <ul>
            <li>
              To use the app, fill in the product name or buzzword in the search field and click on a product.
            </li>
            <li>
              The results will be returned on the right of the web page.
            </li>
            <li>
              You can filter the queues further by selecting a specific Technology from the dropdown.
            </li>
            <li>
              You can reset the search field and technology by clicking the
              <i> clear </i>
              button on the top-right corner.
            </li>
            <li>
              Please make sure to review the transfer resources before transferring a case.
            </li>
          </ul>
          <p>
            If you have any questions about the products or queues, feel free to contact the
            {' '}
            <a style={{ color: '#5cb85c' }} href="mailto:supt-readinessleads@esri.com?subject=Product%20Supportability%20Question">Readiness Leads</a>
            .
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color="success" outline onClick={toggle}>Okay</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

About.defaultProps = {
  className: undefined,
}

About.propTypes = {
  /** label for the button that opens the modal */
  buttonLabel: PropTypes.string.isRequired,
  /** class name for styling */
  className: PropTypes.string,
}

export default About
