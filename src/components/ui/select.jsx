import * as React from "react"

const Select = ({ children, ...props }) => (
  <div className="relative inline-block w-full" {...props}>
    {children}
  </div>
)

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ''}`}
    {...props}
  >
    {children}
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder = "Select an option" }) => (
  <span>{placeholder}</span>
)

const SelectContent = ({ children, ...props }) => (
  <div className="absolute top-full left-0 right-0 mt-1 border border-zinc-300 rounded-md bg-white shadow-lg z-50" {...props}>
    {children}
  </div>
)

const SelectItem = ({ value, children, ...props }) => (
  <div
    className="px-3 py-2 text-sm hover:bg-zinc-100 cursor-pointer"
    data-value={value}
    {...props}
  >
    {children}
  </div>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
