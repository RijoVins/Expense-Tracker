import * as React from "react"

const Tabs = ({ children, defaultValue, onValueChange, ...props }) => (
  <div {...props}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { defaultValue, onValueChange })
    )}
  </div>
)

const TabsList = ({ children, defaultValue, ...props }) => (
  <div className="flex gap-1 border-b border-slate-600" {...props}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { defaultValue })
    )}
  </div>
)

const TabsTrigger = ({ value, children, defaultValue, ...props }) => {
  const isActive = defaultValue === value
  return (
    <button
      className={`px-4 py-2.5 font-semibold transition-all rounded-t-lg ${
        isActive
          ? 'text-white bg-slate-700 border-b-2 border-slate-600'
          : 'text-slate-400 hover:text-slate-300'
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

export { Tabs, TabsList, TabsTrigger }
