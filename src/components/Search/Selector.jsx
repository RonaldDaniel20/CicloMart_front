import PropTypes from 'prop-types'

//This component is used to display the selector of each filter in the search page.

const Selector = (props) => {
  console.log(props)
  const handleChange = (event) => {
    if (props.onFilterChange) {
      props.onFilterChange(props.label, event.target.value)
    }
  }

  return (
    <div>
      <div className="flex flex-col items-start">
        <label className="text-sm font-semibold text-zinc-100 -600 mb-1">
          {props.label}
        </label>
        <select
          className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300 w-full"
          onChange={handleChange}
          value={props.value}
        >
          <option value="" disabled>
            Seleccionar
          </option>
          {props.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        {props.range ? (
          <div className="py-5 flex flex-col items-start">
            <div className="flex justify-between w-full">
              <input
                type="numer"
                placeholder="Mínimo"
                value={props.rangeMin}
                onChange={handleChange}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300 mx-2"
              />
              <span className="mx-2 self-center">-</span>
              <input
                type="numer"
                placeholder="Máximo"
                value={props.rangeMin}
                onChange={handleChange}
                className="w-full px-2 py-1 border rounded focus:outline-none focus:ring focus:border-blue-300 mx-2"
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

Selector.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
}

export default Selector
