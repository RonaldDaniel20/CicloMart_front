import Input from '../components/Input'
import { useForm } from 'react-hook-form'
import Checkbox from '../components/Checkbox'
import Button from '../components/Button'

import { setNotification } from '../store/slices/notificationSlice'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../assets/Context/AuthContext'
import loginService from '../services/loginService'


const Login = () =>{

    const dispatch = useDispatch();

    const navigate = useNavigate();

    useEffect(()=>{
        dispatch(
            setNotification({
              title: 'Hola Redux!',
              text: 'Esto es una notificación de login',
              icon: 'info',
            })
          );
    }, [dispatch])


    const {
        register,
        handleSubmit,
        reset,
    } = useForm()

    //Funcion que almacena los datos del usuario y permite utilizarlo en otros componentes
    const {authUser,
      setAuthUser,
      isLoggedIn,
      setIsLoggedIn,
      isAdmin, 
      setIsAdmin} = useAuth(); 

    const onSubmit = async (data) => {
      try {
        const request = await loginService.loginUser(data);

    
        if (request.status === 200) {

          const {token, user} = request.data;

          dispatch(
            setNotification({
              title: '¡Éxito!',
              text: 'Usuario y contraseña correctos.',
              icon: 'success',
            })
          );

          localStorage.setItem('token', token)
          setIsLoggedIn(true);
          setAuthUser({
            idUser: request.data.user.idUsuario,
            email: request.data.user.correo
          })

          navigate('/userInfo')

    
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(
            setNotification({
              title: '¡ups!',
              text: 'Usuario y contraseña incorrectos.',
              icon: 'error',
            })
          );
        } else {
          console.error('Error:', error.message);
          dispatch(
            setNotification({
              title: 'Error',
              text: `Ocurrió un error: ${error.message}`,
              icon: 'error',
            })
          );
        }
      }
      reset();
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl">
                <h1 className="font-black text-5xl text-center" > Bienvenidos a CicloMart</h1>
                <p className="text-center mt-3">Por favor ingresa tus datos</p>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <Input
                    id="email"
                    label="Correo electrónico"
                    type="email"
                    {...register('email', { required: true })}
                    />
                    <Input
                    id="password"
                    label="Contraseña"
                    type="password"
                    {...register('password', { required: true })}
                    />
                    <div className='flex items-center justify-between'>
                    <Checkbox id="terms" {...register('terms', { required: true })}>
                        Recuerdame
                    </Checkbox>
                    <a href="/register" className="text-sm text-blue-500 hover:underline">
                        ¿Has olvidado tu contraseña?
                    </a>
                    </div>
                    <div className='flex items-center justify-center'>
                        <Button type="submit" 
                                className='text-center bg-blue-500 text-white py-2 px-7 rounded-full'>
                                    Iniciar sesión
                        </Button>
                    </div>
                    <p className="text-center mt-3">
                        ¿No tienes una cuenta?{' '}
                        <a href="/register" className='text-blue-500 hover:underline'>Registrate</a>
                    </p>
                </form>
            </div>
        </div>
    )
}
export default Login;