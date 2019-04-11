// Flexible Compound Components with context

import React from 'react'
import {Switch} from '../switch'

// Right now our component can only clone and pass props to immediate children.
// So we need some way for our compound components to implicitly accept the on
// state and toggle method regardless of where they're rendered within the
// Toggle component's "posterity" :)
//
// The way we do this is through context. React.createContext is the API we
// want. Here's a simple example of that API:
//
// const defaultValue = 'light'
// const ThemeContext = React.createContext(defaultValue)
//   Note: The `defaultValue` can be an object, function, or anything.
//   It's simply what React will use if the useContext(ThemeContext) is used
//   outside a ThemeContext.Provider
//   In our situation, it wouldn't make sense to useContext(ThemeContext)
//   outside a Provider, so you don't have to specify a defaultValue. One of the
//   extra credit items shows how to throw a helpful error message if someone
//   attempts to render a Consumer without a Provider.
//
// ...
// <ThemeContext.Provider value={{on, toggle}}>
//   {children}
// </ThemeContext.Provider>
// ...
//
// ...
// const contextValue = React.useContext(ThemeContext)
// return <div>The current theme is: {contextValue}</div>
// ...

// 🐨 create your ToggleContext context here
// 📜 https://reactjs.org/docs/context.html#reactcreatecontext

// 🐨 remove this, you wont need it anymore! 💣
// function componentHasChild(child) {
//   for (const property in Toggle) {
//     if (Toggle.hasOwnProperty(property)) {
//       if (child.type === Toggle[property]) {
//         return true
//       }
//     }
//   }
//   return false
// }

const ToggleContext = React.createContext()

const useToggle = () => {
  const context = React.useContext(ToggleContext)
  if (!context) {
    throw new Error(
      'Toggle compount compoenent must be rendered within the Toggle component',
    )
  }
  return context
}

function Toggle({onToggle, ...rest}) {
  const [on, setOn] = React.useState(false)

  const toggle = React.useCallback(() => {
    const newOn = !on
    setOn(newOn)
    onToggle(newOn)
  }, [onToggle, on])

  const value = React.useMemo(() => ({on, toggle}), [on, toggle])

  // 🐨 remove all this 💣 and instead return <ToggleContext.Provider> where
  // the value is an object that has `on` and `toggle` on it.
  // return React.Children.map(children, child => {
  //   return componentHasChild(child)
  //     ? React.cloneElement(child, {on, toggle})
  //     : child
  // })
  return <ToggleContext.Provider value={value} {...rest} />
}

// 🐨 we'll still get the children from props (as it's passed to us by the
// developers using our component), but we'll get `on` implicitely from
// ToggleContext now
// 💰 `const context = useContext(ToggleContext)`
// 📜 https://reactjs.org/docs/hooks-reference.html#usecontext
Toggle.On = function On({children}) {
  const {on} = useToggle()
  return on ? children : null
}

// 🐨 do the same thing to this that you did to the On component
Toggle.Off = function Off({children}) {
  const {on} = useToggle()
  return on ? null : children
}

// 🐨 get `on` and `toggle` from the ToggleContext with `useContext`
Toggle.Button = function Button({...props}) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

// 💯 Comment out the Usage function below, and use this one instead:
// const Usage = () => <Toggle.Button />
// Why doesn't that work? Can you figure out a way to give the developer a
// better error message?

////////////////////////////////////////////////////////////////////
//                                                                //
//                 Don't make changes below here.                 //
// But do look at it to see how your code is intended to be used. //
//                                                                //
////////////////////////////////////////////////////////////////////

function Usage() {
  return (
    <div>
      <Toggle onToggle={(...args) => console.info('onToggle', ...args)}>
        <Toggle.On>The button is on</Toggle.On>
        <Toggle.Off>The button is off</Toggle.Off>
        <div>
          <Toggle.Button />
        </div>
      </Toggle>
    </div>
  )
}
Usage.title = 'Flexible Compound Components'

export default Usage
