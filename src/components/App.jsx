import React from 'react'
import Papa from 'papaparse'
import lunr from 'lunr'
import Search from './Search'
import Navb from './ui/Navb'
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      index: null,
      prod: [],
      tech: {},
      techList: [],
    }
    this.parseData = this.parseData.bind(this)
  }

  componentDidMount() {
    this.getCsvData()
    // window.onerror = function errorHandlingIsForScrubs() {
    //   document.location.reload()
    //   return false
    // }
    // jk will add error boundaries soon
    // https://reactjs.org/docs/error-boundaries.html
  }

  async getCsvData() {
    // fetch the csv
    const response = await fetch('/data/product_queue.csv')
    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    const result = await reader.read()
    const csvData = decoder.decode(result.value)

    // parse the csv
    Papa.parse(csvData, {
      complete: this.parseData, // run parseData function on completion
    })
  }

  parseData(result) {
    const prod = [] // final json of products
    const tech = {} // final json of tech to queue
    const techList = [] // for populating the dropdown menu
    const header = result.data[0] // the header of the csv

    const len = header.length - 1
    for (let i = 1; i < len - 2; i += 2) {
      // iterate through the technologies
      // init the json of technologies to queues
      const t = header[i].replace(/\s/g, '')
      tech[t] = []
      techList.push(header[i])
    }
    // iterate through the rows
    result.data.forEach((row, index) => {
      // if the row is not the header
      if (index !== 0) {
        // init the product object
        const object = { product: row[0] } // set the product to the value

        let t = '' // init tech string
        let q = '' // init queue string
        for (let i = 1; i < len - 2; i += 2) {
          // iterate through the technologies
          if (row[i]) {
            // if the queue isn't blank
            q += `${row[i]}, ` // add the queue to the product's list
            t += `${header[i]}, ` // add the tech to the product's list
            // adds the buzzwords for each tech
            // removes spaces in tech like 'Data Management'
            // for the new buzzword variable name
            object[`b_${header[i].replace(/\s/g, '')}`] = row[i + 1]
            if (!tech[header[i].replace(/\s/g, '')].includes(row[i])) {
              // if the queue hasn't already been added to the tech object
              tech[header[i].replace(/\s/g, '')].push(row[i]) // add it
            }
          }
        }
        // regex strips trailing comma from the queue and tech strings
        const strippedT = t.replace(/(^[,\s]+)|([,\s]+$)/g, '')
        const strippedQ = q.replace(/(^[,\s]+)|([,\s]+$)/g, '')
        // set the queue, tech, and support method values
        object.technology = strippedT
        object.queue = strippedQ
        object.supportMethod = row[len - 1]
        // if there is a reference and it is an email address
        if (row[len] && row[len].includes('@')) {
          // set it to the value of email
          object.email = row[len]
        } else {
          // otherwise set it to the value of url
          object.url = row[len]
        }
        prod.push(object) // add the prod object to the array of products
      }
    })
    // after creating the jsons set them to state
    this.setState({ prod })
    this.setState({ tech })
    this.setState({ techList })
    // create the lunr index
    this.createIndex(prod)
  }

  // creates the lunr index
  createIndex(documents) {
    const that = this
    // eslint-disable-next-line func-names
    const idx = lunr(function () {
      // stemming causes issues when doing wildcard searches
      this.pipeline.remove(lunr.stemmer)
      this.searchPipeline.remove(lunr.stemmer)
      // the ref is the unique identifier
      this.ref('product')
      // the fields are for searching
      this.field('product')
      this.field('technology')

      // this makes the buzzword fields for each tech searchable
      // buzzwords in the form of b_Online, b_SDK, etc
      that.state.techList.forEach((t) => {
        this.field(`b_${t.replace(/\s/g, '')}`)
      })

      documents.forEach((doc) => {
        this.add(doc)
      }, this)
    })
    this.setState({ index: idx })
  }

  render() {
    const {
      index, prod, tech, techList,
    } = this.state
    return (
      <>
        <Navb />
        <Search
          index={index}
          prod={prod}
          tech={tech}
          techList={techList}
        />
      </>
    )
  }
}

export default App
