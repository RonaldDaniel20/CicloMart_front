import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'

// componentes
import Loading from '../../components/Loading'
import Button from '../../components/Button'
import Img from '../../components/Img'
import { Favorite, FavoriteBorder } from '@mui/icons-material'

// servicios
import { getProductById } from '../../services/productService'
import mercadoPago from '../../services/mercadoPago'
// utils
import colombianPrice from '../../utils/colombianPrice'
import { clearLoading, setLoading } from '../../store/slices/loadingSlice'
import ProductRating from '../ProductRating'

const ProductPage = () => {
  // Obtiene el id del producto de los parámetros de la URL
  const { id } = useParams()
  const dispatch = useDispatch()
  // Hace fetch del producto con react-query
  const {
    data: producto,
    isLoading,
    isError,
  } = useQuery(['productos', id], () => getProductById(id))

  const handleBuy = async () => {
    dispatch(setLoading())
    const { paymentURL } = await mercadoPago.sendBuyRequest(producto)
    window.location.href = paymentURL
    setTimeout(() => {
      dispatch(clearLoading())
    }, 5000)
  }

  if (isLoading) return <Loading />
  if (isError) return <p>Error: {isError.message}</p>

  return (
    <section className="px-10">
      <div className="flex justify-evenly items-center py-10">
        <Img
          src={producto.imagenURL}
          alt={'Imagen del producto: ' + producto.nombre}
          className="max-w-[500px] max-h-[500px]"
        />
        <div className="p-4">
          <div className="flex items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-wide">
                {producto.nombre}
              </h1>
              <p className="text-2xl text-gray-700 tracking-wide">
                {colombianPrice(producto.precio)}
              </p>
            </div>
            <FavoriteBorder
              sx={{ fontSize: 40, color: 'gray', marginLeft: 4 }}
            />
          </div>
          {/* Detalles del producto */}
          <div className="my-2 tracking-wide">
            <p>
              <b>Marca</b>: {producto.nombreMarca}
            </p>
            <p>
              <b>Tipo</b>: {producto.tipo}
            </p>
            <p>
              <b>Estado</b>:{' '}
              {producto.disponibilidad === 'inmediata'
                ? 'Disponible'
                : 'No disponible'}
            </p>
            <p>
              <b>Publicado el: </b>
              {new Date(producto.fechaPublicacion).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={handleBuy}>Comprar</Button>
        </div>
      </div>
      <div className="py-4">
        <b>Descripción:</b>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. A quos est
          eos nesciunt, laborum nemo ratione neque doloribus ut earum. Odio illo
          ullam totam corrupti sint omnis quas, asperiores ipsam?
        </p>
      </div>
      <div>
        <ProductRating />
      </div>
    </section>
  )
}

export default ProductPage
