import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Script from 'react-load-script'
const loadScript = require('load-script')

var defaultScriptUrl = 'ckeditor/ckeditor.js'

class CKEditor extends React.Component {
  constructor (props) {
    super(props)

    // Bindings
    this.onLoad = this.onLoad.bind(this)

    // State initialization
    this.state = {
      isScriptLoaded: this.props.isScriptLoaded,
      config: this.props.config
    }
  }

  // load ckeditor script as soon as component mounts if not already loaded
  componentDidMount () {
    if (!this.props.isScriptLoaded) {
      loadScript(this.props.scriptUrl, this.onLoad)
    } else {
      this.onLoad()
    }
  }

  componentWillUnmount () {
    this.unmounting = true
  }

  onLoad () {
    if (this.unmounting) return

    this.setState({
      isScriptLoaded: true
    })

    if (!window.CKEDITOR) {
      console.error('CKEditor not found')
      return
    }

    ReactDOM.findDOMNode(this).innerHTML = this.props.content
    this.editorInstance = window.CKEDITOR.inline(
      ReactDOM.findDOMNode(this),
      this.state.config
    )

    // Register listener for custom events if any
    for (var event in this.props.events) {
      var eventHandler = this.props.events[event]

      this.editorInstance.on(event, eventHandler)
    }
  }

  render () {
    return <div contenteditable='true' className={this.props.activeClass} />
  }
}

CKEditor.defaultProps = {
  content: '',
  config: {
  },
  isScriptLoaded: false,
  scriptUrl: defaultScriptUrl,
  activeClass: '',
  events: {}
}

CKEditor.propTypes = {
  content: PropTypes.any,
  config: PropTypes.object,
  isScriptLoaded: PropTypes.bool,
  scriptUrl: PropTypes.string,
  activeClass: PropTypes.string,
  events: PropTypes.object
}

export default CKEditor
