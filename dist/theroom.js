/*!
* theroomjs v2.0.8
* A vanilla javascript plugin that allows you to outline dom elements like web inspectors.
* Works with Chrome, Firefox, Safari, Internet Explorer and Edge
*
* Author: Huseyin ELMAS
*/
(function (window, document, namespace) {
  var status = 'idle'

  // defaults
  var options = {
    inspector: null,
    htmlClass: true,
    blockRedirection: false,
    createInspector: false,
    excludes: []
  }

  var getInspector = function () {
    if (typeof options.inspector === 'string') {
      // if the provided inspector is a css selector, return the element
      var el = document.querySelector(options.inspector)

      if (el) return el
      else throw Error('inspector element not found')
    }

    // eslint-disable-next-line
    if (options.inspector instanceof Element) {
      // if the provided inspector is a dom element, return it
      return options.inspector
    }

    if (!options.inspector && options.createInspector) {
      // create an inspector element
      var _inspector = document.createElement('div')
      _inspector.className = 'inspector-element'
      document.body.appendChild(_inspector)
      return _inspector
    }

    throw Error('inspector must be a css selector or a DOM element')
  }

  var getExclusionSelector = function () {
    return options.excludes.join(',')
  }

  var applyOptions = function (opts) {
    if (typeof opts !== 'object') throw Error('options is expected to be an object')

    // merge
    for (var opt in opts) {
      // eslint-disable-next-line
      if (opts.hasOwnProperty(opt)) {
        options[opt] = opts[opt]
      }
    }
  }

  var eventEmitter = function (event) {
    // hook event invocation
    eventController('hook', event)

    var target = event.target

    // validation --skip inspector element itself--
    if (!target || target === options.inspector) return

    // do not inspect excluded elements
    var excludedSelector = getExclusionSelector()
    if (excludedSelector) {
      var excludedElements = Array.prototype.slice.call(document.querySelectorAll(excludedSelector))
      if (excludedElements.indexOf(target) >= 0) return
    }

    if (event.type === 'mouseover') {
      // get target element information
      var pos = target.getBoundingClientRect()
      var scrollTop = window.scrollY || document.documentElement.scrollTop
      var scrollLeft = window.scrollX || document.documentElement.scrollLeft
      var width = pos.width
      var height = pos.height
      var top = Math.max(0, pos.top + scrollTop)
      var left = Math.max(0, pos.left + scrollLeft)

      // set inspector element position and dimension
      options.inspector.style.top = top + 'px'
      options.inspector.style.left = left + 'px'
      options.inspector.style.width = width + 'px'
      options.inspector.style.height = height + 'px'
    }

    // event invocation
    eventController(event.type, target, event)
  }

  var engine = function (type) {
    var htmlEl = document.querySelector('html')

    if (type === 'start') {
      if (options.blockRedirection === true) {
        // block page redirection
        window.onbeforeunload = function () {
          return true
        }
      }

      // bind event listeners
      document.addEventListener('click', eventEmitter)
      document.addEventListener('mouseover', eventEmitter)

      // add namespace to HTML tag class list
      if (options.htmlClass === true) htmlEl.className += ' ' + namespace

      status = 'running'
    } else if (type === 'stop') {
      // remove binded event listeners
      document.removeEventListener('click', eventEmitter)
      document.removeEventListener('mouseover', eventEmitter)

      // remove namespace from HTML tag class list
      if (options.htmlClass === true) htmlEl.className = htmlEl.className.replace(' ' + namespace, '')

      // remove blocking page redirection
      if (options.blockRedirection === true) window.onbeforeunload = undefined

      status = 'stopped'
    }
  }

  var eventController = function (type, arg, arg2) {
    if (!options[type]) return
    if (typeof options[type] !== 'function') throw Error('event handler must be a function: ' + type)

    // call the event
    options[type].call(null, arg, arg2)
  }

  var start = function (opts) {
    if (opts) {
      this.configure(opts)
    }

    // get the inspector element
    options.inspector = getInspector()

    eventController('starting')

    // start the inspection engine
    engine('start')

    eventController('started')
  }

  var stop = function (resetInspector) {
    eventController('stopping')

    // stop the inspection engine
    engine('stop')

    if (resetInspector === true) {
      options.inspector.style.top = ''
      options.inspector.style.left = ''
      options.inspector.style.width = ''
      options.inspector.style.height = ''
    }

    if (options.createInspector === true) {
      // remove auto generated inspector element on stop
      options.inspector.remove()
      options.inspector = undefined
    }

    eventController('stopped')
  }

  var eventBinder = function (name, handler) {
    if (typeof name !== 'string') throw Error('event name is expected to be a string but got: ' + typeof name)
    if (typeof handler !== 'function') throw Error('event handler is not a function for: ' + name)

    // update the event
    options[name] = handler
  }

  // make it accessible from outside
  window[namespace] = {
    start: start,
    stop: stop,
    on: eventBinder,
    configure: function (opts) {
      // merge provided options with defaults
      applyOptions(opts)
    },
    status: function () {
      return status
    }
  }
})(window, document, 'theRoom')
