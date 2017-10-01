import { h } from 'preact' // eslint-disable-line no-unused-vars

export default ({ href, children, onClick, className }) => (
  <a
    href={href}
    className={className}
    onClick={(e) => {
      if (onClick) onClick(e)
      const { button, metaKey, altKey, ctrlKey, shiftKey, defaultPrevented } = e
      if (button !== 0 || metaKey || altKey || ctrlKey || shiftKey || defaultPrevented === true) {
        return
      }
      e.preventDefault()
    }
    }
  >{ children }</a>
)
