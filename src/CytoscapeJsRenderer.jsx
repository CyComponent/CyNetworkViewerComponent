import React, {Component} from 'react'
import cytoscape from 'cytoscape'
import * as config from './CytoscapeJsConfig'


class CytoscapeJsRenderer extends Component {

  constructor(props) {
    super(props)

    this.state = {
      rendered: false,
      vs: 'default',
    }
  }


  updateCyjs(networkData) {
    if(networkData === undefined || networkData === null) {
      return;
    }

    console.log("* Cytoscape.js redering start")

    this.state.rendered = true
    let network = networkData
    console.log(network)

    // Case 1: network has Style section
    let visualStyle = network.style
    let layoutFlag = false

    if (visualStyle === undefined || visualStyle === null || visualStyle === {}) {

      if(visualStyle === null) {
        layoutFlag = true
      }
    } else {
    }

    const cy = this.state.cyjs
    cy.add(network.elements.nodes)
    cy.add(network.elements.edges)
    // if(layoutFlag) {
    //   cy.layout({ name: LAYOUT })
    // }
    cy.fit()
  }

  componentDidMount() {
    // Create Cytoscape.js instance here, only once!

    let visualStyle = this.props.networkStyle
    if(visualStyle === undefined) {
      visualStyle = config.DEF_VS
    }

    const cy = cytoscape(
      Object.assign(
        {
          container: document.getElementById(this.props.networkId),
          elements: [],
          style: visualStyle,
          layout: {
            name: config.DEF_LAYOUT
          }
        }))
    this.setEventListener(cy)
    this.state.cyjs = cy
    this.updateCyjs(this.props.network)
    console.log("*** CyJS initialized!")
  }


  // shouldComponentUpdate(nextProps, nextState) {
  //   // React is responsible only for the root Cytoscape tag.
  //   // and in this section, the only thing we need to check is background and network.
  //   console.log("$$$$$$$$$ Checking props")
  //   if(!this.state.rendered) {
  //     console.log("$$$$$$$$$ NEED rendering")
  //     this.updateCyjs(this.props.network)
  //     return true
  //   }
  //
  //   if (nextProps.network === this.props.network) {
  //     // Is this background update?
  //     if(nextProps.backgroundColor === this.props.backgroundColor) {
  //       return false
  //     } else {
  //       return true
  //     }
  //   }
  //   return true
  // }

  componentWillReceiveProps(nextProps) {
    // const command = nextProps.commands.command
    // if(command !== '') {
    //   const cy = this.state.cyjs
    //   if(command === 'fit') {
    //     cy.fit()
    //   }
    //   else if(command === 'zoomIn') {
    //     cy.zoom(cy.zoom() * 1.2)
    //   }
    //   else if(command === 'zoomOut') {
    //     cy.zoom(cy.zoom() * 0.8)
    //   }
    //   this.props.commandActions.reset()
    //   return
    // }
    //
    // // Style
    // const curVs = this.state.vs
    // const nextVs = nextProps.currentVs.get('vsName')
    // if(curVs !== nextVs) {
    //   const vs = this.props.styles.get(nextVs)
    //   this.state.cyjs.style(vs)
    //   this.setState({
    //     vs: nextVs
    //   })
    //
    //   return;
    // }


    if (nextProps === undefined || nextProps.network === undefined) {
      console.log("=========== NO DATA");
      return
    }

    if (nextProps.network === this.props.network
      && this.state.rendered === true) {
      return
    }
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    console.log(this.state.rendered)
    // if(!this.state.rendered) {
      this.updateCyjs(nextProps.network)
    // }
  }


  /**
   * Translate Cytoscape.js events into action calls
   * @param cy
   */
  setEventListener(cy) {

    console.log("CYJS event handlers")

    console.log(this.props.eventHandlers)

    cy.on(config.SUPPORTED_EVENTS, event => {

      const eventType = event.originalEvent.type
      const target = event.cyTarget;

      if(target === undefined) {
        return
      }

      switch (eventType) {
        case config.CY_EVENTS.select:
          if(target.isNode()) {
            this.props.eventHandlers.selectNodes(this.props.networkId, [target.data().id])
          } else {
            this.props.eventHandlers.selectEdges(this.props.networkId, [target.data().id])
          }

          break
        case config.CY_EVENTS.unselect:
          if(target.isNode()) {
            this.props.eventHandlers.deselectNodes(this.props.networkId, [target.data().id])
          } else {
            this.props.eventHandlers.deselectEdges(this.props.networkId, [target.data().id])
          }
          break
        default:
          break
      }
    })
  }


  render() {
    const id = this.props.networkId
    const style = this.props.style

    return (
      <div
        id={id}
        style={style}
      />
    )
  }
}

export default CytoscapeJsRenderer
