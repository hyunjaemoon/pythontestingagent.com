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
      </div>
      <StatusIndicator />
    </nav>
  )
}

export default SiteNav
