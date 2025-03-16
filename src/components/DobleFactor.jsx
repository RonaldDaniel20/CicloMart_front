import background from '../assets/background1.webp'
import { useForm } from 'react-hook-form'
import { setNotification } from '../store/slices/notificationSlice'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { clearLoading, setLoading } from '../store/slices/loadingSlice'
import Button from '../components/Button'
import Input from '../components/Input'
import loginService from '../services/loginService'

const DobleFactor = () =>{

    const { register, handleSubmit, setValue } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { token } = useParams()

    const onSubmit = async (data) => {
        console.log(data);
        console.log(token)
        const request = loginService.validateTokenFactorUser(data.code, token)
        if(request.status === 200){
            navigate('/')
        }else{
            navigate('/login')
        }
        
    }
    return (
        <div className="flex items-center justify-center h-screen-minus-navbar">
          <img
            src={background}
            alt="Fondo de bicicletas"
            className="absolute object-cover -z-10 blur-sm "
          />
          <div className="bg-white p-8 rounded shadow-md w-400 max-w-4xl">
            <h1 className="font-black text-5xl text-center">
              {' '}
              Verificación de cuenta{' '}
            </h1>
            <p className="text-center mt-3">
              {' '}
              Has alcanzado el límite de intentos. Te hemos enviado un correo con un código; por favor, ingrésalo{' '}
            </p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                id="code"
                label="Código"
                type="number"
                {...register('code', { required: true })}
              />
              <div className="flex items-center justify-center mt-5">
                <Button
                  type="submit"
                  className="text-center bg-tertiary text-white py-2 px-7 rounded-full"
                >
                  Continuar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )
}

export default DobleFactor