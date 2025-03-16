
import Input from '../components/Input'
import { useForm } from 'react-hook-form'
import Checkbox from '../components/Checkbox'
import Button from '../components/Button'
import background1 from '../assets/background1.webp'

import { setNotification } from '../store/slices/notificationSlice'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setAuthUser, setIsLoggedIn } from '../store/slices/authSlice'
import loginService from '../services/loginService'
import { useRef, useState } from 'react'
import { clearLoading, setLoading } from '../store/slices/loadingSlice'


//Captcha

import ReCAPTCHA from 'react-google-recaptcha'
const API_CAPTCHA = import.meta.env.VITE_CAPTCHA
import DOMPurify from 'dompurify'


const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const captcha = useRef(null);
  const [attempts, setAttempts] = useState(0)

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/

  const onSubmit = async (data) => {
    try {

      const sanitizedData = {
        email: DOMPurify.sanitize(data.email),
        password: DOMPurify.sanitize(data.password),

      }

      if(!captcha.current.getValue()){
        dispatch(
          setNotification({
            title:'Captcha requerido',
            text:'Por favor, completa el captcha antes de continuar ',
            icon:'error'
          })
        )
      return
      }

      const validateCaptcha = await loginService.validateCaptcha( captcha.current.getValue())

      if(!validateCaptcha.success){
        dispatch(
          setNotification({
            title: 'Captcha Invalido',
            text: 'La validación del captcha fallo',
            icon: 'error'
          })
        )
        return
      }

      if (attempts > 1) {
        try {

          dispatch(setLoading())
          const validateUser = await loginService.generateTokenFactorUser(data.email);
    
          if (validateUser.success) {
            dispatch(clearLoading())
            navigate(`/verificationUser/${validateUser.token}`)
          }
          return
        } catch (error) {
          if (error.response && error.response.status === 401) { 
            dispatch(
              setNotification({
                title: '¡Ups!',
                text: 'El correo debe ser el que registraste en la app.',
                icon: 'error',
              })
            );
          }
          return
        } finally {
          setAttempts(0);
          reset();
          captcha.current.reset();
          dispatch(clearLoading())
        }
      }
      
      
      const request = await loginService.loginUser(sanitizedData)

      if (request.status === 200) {
        const { token, user } = request.data

        dispatch(
          setNotification({
            title: '¡Éxito!',
            text: 'Usuario y contraseña correctos.',
            icon: 'success',
            timer: 1000,
          })
        )

        localStorage.setItem('token', token)
        dispatch(setIsLoggedIn(true))
        dispatch(
          setAuthUser({
            ...user,
            idUser: user.idUsuario,
            email: user.correo,
            nombre: user.nombre,
          })
        )
        reset()
        navigate('/')
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        dispatch(
          setNotification({
            title: '¡ups!',
            text: 'Usuario y contraseña incorrectos.',
            icon: 'error',
          })
        )
        setAttempts((prevAttemps) => prevAttemps + 1)
        captcha.current.reset()
      } else {
        console.error('Error:', error.message)
        dispatch(
          setNotification({
            title: 'Error',
            text: `Ocurrió un error: ${error.message}`,
            icon: 'error',
          })
        )
      }
    }
  }

  return (
    <div className="flex items-center justify-center md:h-screen-minus-navbar">
      <img
        src={background1}
        alt="Fondo de bicicletas"
        className="absolute object-cover -z-10 blur-sm "
      />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-3xl">
        <h1 className="font-black text-5xl text-center">
          {' '}
          Bienvenido a CicloMart
        </h1>
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
          {...register('password', {
            required: 'Password is required',
            pattern: {
              value: passwordRegex,
              message:
                'La contraseña debe tener al menos 6 caracteres, una letra mayúscula, una letra minúscula y un número.',
            },
          })}
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {errors.password.message}
          </span>
        )}
          <div className="flex items-center justify-between">
            <Checkbox
              id="recuerdame"
              {...register('recuerdame', { required: false })}
            >
              Recuerdame
            </Checkbox>
            <Link
              to="/verificacion"
              className="text-sm text-blue-500 hover:underline text-center"
            >
              ¿Has olvidado tu contraseña?
            </Link>
          </div>
          <div className="flex flex-col space-y-2 items-center justify-center">
            <ReCAPTCHA ref={captcha} sitekey = {API_CAPTCHA}></ReCAPTCHA>
            <Button
              type="submit"
              className="text-center bg-blue-500 text-white py-2 px-7 rounded-full"
            >
              Iniciar sesión
            </Button>
          </div>
          <p className="text-center mt-3">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Registrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
