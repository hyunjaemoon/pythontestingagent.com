import SignatureIcon from './SignatureIcon'
import StatusIndicator from './StatusIndicator'

const SiteNav = () => {
  return (
    <nav
      aria-label="Site"
      className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
    >
      <div className="flex items-center gap-3">
        <SignatureIcon />
        <span className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-secondary-500">
          hyunjaemoon
        </span>
      </div>
      <StatusIndicator />
    </nav>
  )
}

export default SiteNav
