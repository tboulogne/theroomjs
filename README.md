# theroomjs
> A vanilla javascript plugin that allows you to outline DOM elements like web inspectors.

[![NPM](https://nodei.co/npm/theroomjs.png)](https://nodei.co/npm/theroomjs/)

`theroomjs` can be accessable globally as `theRoom`. It's compatible with modern browsers such as Google Chrome, Mozilla Firefox, Safari, Edge and Internet Explorer.

## Options

| Name              | Type               | Default    | Description                         |
| ---               | ---                | ---        | ---                                 |
| inspector         | string or DOM node | -          | Placeholder element for inspection. It will not be inspected |
| createInspector   | boolean            | false      | If `true` and inspector option is not provided, theRoom will try to create an inspector element whose class is `inspector-element` for you and will be appended to `<body/>` |
| htmlClass         | boolean            | true       | If `true` theRoom's namespace will be automatically added to `<html/>` element class list |
| blockRedirection  | boolean            | false      | If `true` the page will not be redirected elsewhere. theRoom will override `onbeforeunload` to do that |
| excludes          | array (string)     | -          | Elements that excluded for inspection. Basic CSS selectors are allowed. For more information please see [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector) |

## Events

| Name       | Description                                              |
| ---        | ---                                                      |
| starting   | Fired when inspection is being started                   |
| started    | Fired when inspection is started                         |
| stopping   | Fired when inspection is being stopped                   |
| stopped    | Fired when inspection is stopped                         |
| click      | Fired when the inspected element is clicked. The element is passed as the first argument, [Event](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) passed as the second argument |
| mouseover  | Fired when the inspected element mouseovered. The element is passed as the first argument, [Event](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) passed as the second argument |
| hook       | Fired at the very beginning of `click` and `mouseover` event listeners. [Event](https://developer.mozilla.org/en-US/docs/Web/API/Event) passed as the only argument |

> Events can also be defined in options.

## theRoom object

`theRoom` global object exposes those:

| Option            | Type     | Parameters                          | Description                                               |
| ---               | ---      | ---                                 | ---                                                       |
| on                | function | `event name` and `handler function` | To dynamically event binding                              |
| start             | function | `options` (optional)                | To start inspection                                       |
| stop              | function | `resetInspector` (optional)         | To stop inspection                                        |
| configure         | function | `options`                           | To override theRoom option(s) anytime                     |
| status            | function | -                                   | Gets inspection engine status. Can be `idle`, `running` and `stopped` |

## Usage

```javascript
  // setup/configure theRoom before inspection
  // this configurations can be passed in 'start' event as well
  window.theRoom.configure({
    inspector: '.inspector-element',
    blockRedirection: true,
    excludes: ['footer'],
    click: function (element) {
      console.log('element is clicked:', element)
    }
  })

  // start inspection
  window.theRoom.start()

  // dynamically bind event
  window.theRoom.on('mouseover', function (element) {
    console.log('the element is hovered', element)
  })

  // stop inspection
  // and reset inspector styles
  window.theRoom.stop(true)

  // log the current status
  console.log(
    window.theRoom.status() // will print out -> stopped
  )
```

## Contribution
Contributions and pull requests are kindly welcomed!

## License
This project is licensed under the terms of the [MIT license](https://github.com/hsynlms/theroomjs/blob/master/LICENSE).
