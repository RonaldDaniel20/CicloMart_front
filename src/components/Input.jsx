import { forwardRef, useRef, useState, useImperativeHandle } from 'react'
import { twMerge } from 'tailwind-merge'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import PropTypes from 'prop-types'

const Input = forwardRef(
  (
    {
      label = 'Placeholder here',
      type = 'text',
      id,
      className = '', // custom class for container
      required = true,
      ...props
    },
    ref
  ) => {
    const internalRef = useRef(null) // internal reference for input element
    const [passwordVisible, setPasswordVisible] = useState(false)

    useImperativeHandle(ref, () => internalRef.current) // expose internal reference to parent component

    const toggleVisibility = () => {
      setPasswordVisible((prev) => !prev)
      if (internalRef.current) {
        internalRef.current.type = passwordVisible ? 'password' : 'text'
      }
    }

    return (
      <div className={twMerge('mt-5 relative group', className)}>
        <input
          id={id}
          type={type}
          name={id}
          className="peer h-10 w-full border-b-[1.5px] border-gray border-opacity-75 text-gray-900 placeholder-transparent focus:border-primary focus:outline-none bg-inherit"
          placeholder={label}
          required={required}
          ref={internalRef}
          {...props}
        />
        <label
          htmlFor={id}
          className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-primary peer-focus:text-sm"
        >
          {label}
        </label>
        {type === 'password' && (
          <button
            type="button"
            onClick={toggleVisibility}
            className="absolute right-0 top-2 text-gray-600 hover:text-gray-900"
          >
            {passwordVisible ? <VisibilityOff /> : <Visibility />}
          </button>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
}

export default Input
