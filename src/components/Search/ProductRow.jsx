import PropTypes from 'prop-types'

//This component is used to display each product row in the table display of search page.

const ProductRow = (props) => {
  return (
    <div className="grid grid-cols-4 border-b py-4 px-4 items-center">
      <div className="flex items-center">
        <img src={props.image} alt={props.title} className="h-20 w-20 mr-4" />
      </div>
      <div className="">
        <h3 className="text-sm font-bold">{props.description}</h3>
        <p className="text-xs text-gray-600">{props.brand}</p>
      </div>
      <span className="text-gray-800">{props.type}</span>
      <span className="text-gray-800">{props.price}</span>
    </div>
  )
}

ProductRow.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  brand: PropTypes.string,
  type: PropTypes.string,
  price: PropTypes.string,
}

export default ProductRow
