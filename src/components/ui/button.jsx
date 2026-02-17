import * as React from "react"

const Button = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    const variants = {
      default: "bg-zinc-900 text-white hover:bg-zinc-800",
      outline: "border border-zinc-300 bg-white hover:bg-zinc-50",
      ghost: "hover:bg-zinc-100",
    }
    const sizes = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6",
    }
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ''}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
