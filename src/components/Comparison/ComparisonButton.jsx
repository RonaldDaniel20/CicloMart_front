// Icons
import CompareArrows from '@mui/icons-material/CompareArrows'

const handleComparison = (event) => {
  event.stopPropagation()
  event.preventDefault()
  console.log('Comparando')
}

const ComparisonButton = () => {
  return (
    <button
      className="bg-secondary px-4 rounded-bl-full absolute top-0 right-0 flex flex-row duration-200 ease-in-out hover:scale-105 opacity-0 group-hover:opacity-100"
      onClick={handleComparison}
    >
      <b className="mr-2">Comparar</b>
      <CompareArrows />
    </button>
  )
}

export default ComparisonButton
