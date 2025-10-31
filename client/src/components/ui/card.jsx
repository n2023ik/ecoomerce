export function Card({ className = '', children, ...rest }) {
  return <div className={`card ${className}`} {...rest}>{children}</div>
}
export function CardHeader({ className = '', children, ...rest }) {
  return <div className={`p-4 border-b border-slate-200 ${className}`} {...rest}>{children}</div>
}
export function CardTitle({ className = '', children, ...rest }) {
  return <h3 className={`text-lg font-semibold ${className}`} {...rest}>{children}</h3>
}
export function CardContent({ className = '', children, ...rest }) {
  return <div className={`p-4 ${className}`} {...rest}>{children}</div>
}
