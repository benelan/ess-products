/* eslint-disable react/no-this-in-sfc */
import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import lunr from 'lunr'
import Search from './components/Search'
import Navb from './components/ui/Navb'
import ErrorBoundary from './components/ErrorBoundary'

/**
 * Loads CSV data, parses it to JSON, and creates a search index
 * @author Ben Elan
 * @component
 * @child Navbar, Search
 */
const App = () => {
  const [index, setIndex] = useState(null)
  const [product, setProd] = useState([])
  const [technology, setTech] = useState({})
  const [technologyList, setTechList] = useState([])
  const [isMobile, setMobile] = useState(false)

  /**
   * Checks if the device is mobile based on user agent
   * The UI renders differently on mobile for readability
   * @method
   * @static
   * @return {Boolean} is it a mobile device?
   */
  const checkIsMobile = () => !!(
    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
      navigator.userAgent,
    )
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(
        navigator.userAgent.substr(0, 4),
      )
  )

  /**
   * Fetches csv and parses it to json
   * @method
   * @static
   * @param  {String} path - where to fetch csv
   * @return {Object} parsed json data
   */
  const getData = (pathToCSV) => new Promise((resolve, reject) => {
    Papa.parse(pathToCSV, {
      download: true,
      complete(data) {
        resolve(data)
      },
      error(err) {
        reject(err)
      },
    })
  })

  /**
    * Parses csv data into format needed by Lunr
    * @method
    * @static
    * @param  {Object} jsonData - the JSON data parsed from the csv
    * @return {Object} contains the properties below
    * @return {Array} - prod: the product key/value pairs to search
    * @return {Object} - tech: the key technologies and their queues
      @return {Array} - techList: list of technologies for dropdown
  */
  const parseData = (jsonData) => {
    const prod = [] // final json of products
    const tech = {} // final json of tech to queue
    const techList = [] // for populating the dropdown menu
    const header = jsonData[0] // the header of the csv

    const len = header.length - 1
    // iterate through the technology/buzzword pairs
    for (let i = 1; i < len - 2; i += 2) {
      // init the json of technologies to queues
      const t = header[i].replace(/\s/g, '')
      tech[t] = []
      techList.push(header[i])
    }
    // iterate through the rows
    jsonData.forEach((row, idx) => {
      // if the row is not the header
      if (idx !== 0) {
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
            // removes spaces in tech like 'Data Management' for the new buzzword variable name
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

    const finalResults = {
      prod,
      tech,
      techList,
    }
    return finalResults
  }

  /**
   * Creates the lunr search index
   * @param  {Object} documents - The key:value pairs to be searched
   * @param  {Object} techArray - the full list of technologies
   * @return {Object} the search index
   */
  const createIndex = (documents, techArray) => lunr(function idx() {
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
    techArray.forEach((t) => {
      this.field(`b_${t.replace(/\s/g, '')}`)
    })

    documents.forEach((doc) => {
      this.add(doc)
    }, this)
  })

  useEffect(() => {
    (async () => {
      // get the csv and convert it to json
      const response = await getData('./data/product_queue.csv')
      // parse the json creating objects/arrays
      const { prod, tech, techList } = parseData(response.data)
      // create the search index
      const idx = createIndex(prod, techList)
      // check if the user agent is a mobile device
      const mobile = checkIsMobile()

      setTech(tech)
      setProd(prod)
      setTechList(techList)
      setIndex(idx)
      setMobile(mobile)
    })()
  }, [])

  // window.onerror = () => { document.location.reload(); return false }
  return (
    <ErrorBoundary buttonClass="btn btn-success btn-sm ml-2">
      <Navb />
      <Search
        index={index}
        prod={product}
        tech={technology}
        techList={technologyList}
        isMobile={isMobile}
      />
    </ErrorBoundary>
  )
}

export default App
