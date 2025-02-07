import RatingView from "../components/RatingView";
import Button from '../components/Button';
import { useForm } from 'react-hook-form';
import { FaStar, FaUpload } from "react-icons/fa";
import Input from '../components/Input';
import { useState, useRef, useEffect } from "react";
import StarRating from "../components/StarRating";
import { setNotification } from "../store/slices/notificationSlice";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import ratingService from "../services/ratingService";
import axios from "axios";
import Loading from "../components/Loading";

const ProductRating = (props) => {

    //En las props se debe pasar el id del producto que sea calificar

    const { register, handleSubmit, reset } = useForm();
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [commentList, setCommentList] = useState([]);
    const [newCommentAdded, setNewCommentAdded] = useState(false);
    const [ avgRating, setAvgRating] = useState(0);
    const [ userCalificate, setUserCalificate] = useState(false);
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();

    //id de prueba (se debe cambiar por los ids de la props o hacer una peticion para obtener los ids)

    const idCom = 6;
    const idDoc = 1;
    const idVen = 3;

    //Obteniendo el id del usuario logueado

    const authUser = useSelector((state) => state.auth.authUser);
 
    const checkPurchase = async () => {

        try{

            console.log(authUser.idUsuario);
            if(!authUser || !authUser.idUsuario) return <Loading />

            const idUsuario = authUser.idUsuario;

            const request = await ratingService.checkUserPurchase({
                "idComprador": authUser.idUsuario,
                "idDocProducto": idDoc
            })

            console.log(request);

        }catch(error){
            console.error("Ocurrio un error ", error)
        }

    }


    //Valida si se introdujo un comentario y se marco alguna estrella
    const validateFields = ( Comment, Rating) =>{

        if(!Comment || !Rating){
            dispatch(
                setNotification({
                    title: "¡UPS!",
                    text: "Califica con algúna estrella",
                    icon: "error",
                    timer: 3000
                })
            )
            return -1
        }
        return 0
    }

    //Carga la imagen 
    const ImageUpload = (e) => {
        const file = e.target.files[0];
        if(file && file.type.startsWith('image/')){
            setImage(file);
            setError('');
        }else{
            dispatch(
                setNotification({
                    title: "¡UPS!",
                    text: "Selecciona un archivo de imagen válido",
                    icon: "error",
                    timer: 3000
                })
            )
        }
    }

    // Obtiene todos las calificaciones del producto
    const getProductRating = async () =>{

       try{
            const request = await ratingService.getRatingProduct(5);
            setCommentList(request.results);
            getAvgRating();
            checkPurchase();
       }catch (error) {
            console.error('Error al obtener las calificaciones', error)
       }
    }

    // Renderiza cuando se añade un nuevo comentario
    useEffect(() =>{
        getProductRating();
    }, [newCommentAdded])


      
    // Envia la calificación al backend
    const onSubmit = async (data) => {
        // Maneja el envío del formulario
        try{
            if(validateFields(data.calificacion, rating) === 0){
                if(!image){
                    
                    const request = await ratingService.createRating({

                        "idUsuarioComprador": idCom,
                        "idDocumentoProducto": idDoc,
                        "idUsuarioVendedor": idVen,
                        "comentario": data.calificacion,
                        "nota": rating
                    })
                    
                    setNewCommentAdded(true);
                    dispatch(
                        setNotification({
                            title: "Comentario",
                            text: "Tú comentario se ha añadio con éxito",
                            icon: "success",
                            timer: 3000
                        })
                    )
                    return;
                }

                const formData = new FormData();
                console.log(image);
                formData.append('file', image);
                formData.append('upload_preset', 'cicloMart');

                

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dg354wdzy/image/upload', // Reemplaza con tu cloud name
                    formData
                )

                const request = await ratingService.createRating({
                    "idUsuarioComprador": idCom,
                    "idDocumentoProducto": idDoc,
                    "idUsuarioVendedor": idVen,
                    "comentario": data.calificacion,
                    "foto": response.data.secure_url,
                    "nota": rating
                });

                setNewCommentAdded(true);
                dispatch(
                    setNotification({
                        title: "Comentario",
                        text: "Tú comentario se ha añadio con éxito",
                        icon: "success",
                        timer: 3000
                    })
                )
            }
        }catch (error){
            console.error(error.response.data);
            setNewCommentAdded(false);
            dispatch(
                setNotification({
                    title: "¡UPS!",
                    text: "Ocurrio un error. Vuelve a intentarlo",
                    icon: "error",
                    timer: 3000
                })
            )
        }finally{
            setImage(null);
            setRating(null);
            reset();
        }
    };

    const getAvgRating = async () => {
        try{
            
            const request = await ratingService.getAvgRatingProduct(5);
            setAvgRating(request.results[0].avg_calificacion);

        }catch (error){
            console.error("Error al obtener el promedio de las calificaciones", error);
        }
    }

    const StartGenerate = () =>{
        
        return (
            <div className="Calificacion_Start items-center flex-col flex mt-4">
                <div className="flex">
                {[...Array(5)].map((start, index) =>{
                    const currentRating = index + 1
                    return (
                     <label className="inline-block" key={index}>
                        <input 
                            type="radio" 
                            name="rating" 
                            value = {currentRating}
                            onClick={() => setRating(currentRating)}
                            className="hidden"
                        />
                        <FaStar 
                            className="StartRating cursor-pointer" 
                            size={30} 
                            color={currentRating <= (hover || rating) ? "#ffc107":"#e4e5e9"}
                            onMouseEnter={() => setHover(currentRating)}
                            onMouseLeave={() => setHover(null)}
                        />
                     </label>
                    )
                })}
                </div>
                <div>
                    <p className="mt-2">Tu calificación es {rating}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen-minus-navbar px-8 py-12 overflow-auto">
            <h2 className="font-black text-2xl">
                {' '}
                Opiniones del producto
            </h2>
            <div className="mt-4">
                <div className="flex  items-start space-x-12">
                    <div className="flex space-x-5 items-center">
                        <div className="text-7xl font-bold text-blue-500">{avgRating}</div>
                        <div className="flex flex-col">
                            {
                                !avgRating ? (
                                    <StarRating rating ={0} size="star-large"/>
                                ):(
                                    <StarRating rating ={avgRating} size="star-large"/>
                                )
                            }
                            <p className="text-sm ">{commentList.length } comentario</p>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                    {commentList.length === 0 ? (
                            <p>No hay comentarios disponibles.</p>
                        ) : (
                            commentList.map((val, key) => (
                                
                                <div key={val.idCalificacion}>
                                    <RatingView
                                        description={val.comentario}
                                        date={val.fecha}
                                        rating={val.nota}
                                        image = {val.foto}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <h2 className="py-2 font-black text-2xl">
                ¿Tienes dudas del producto?
            </h2>
            <p>Puedes iniciar chat con el vendedor</p>
            <div className="py-4">
                <Button
                    type="button"
                    className="text-center py-1 px-2 bg-blue-500 text-white rounded"
                    to="/login"
                >
                    Iniciar chat
                </Button>
            </div>
            <div className="py-1">
                <h2 className="py-2 font-black text-2xl">
                    Deja tú comentario
                </h2>
                <div className="flex justify-center items-center ">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-3xl gap-3">
                    <div className="flex flex-row items-center gap-4">
                            <div className="flex-grow">
                                <Input 
                                    id="calificacion"
                                    label="Ingresa tu comentario"
                                    type="textarea"
                                    {...register('calificacion', { required: false })}
                                    className="w-full"
                                />
                            </div>
                            <div className="relative flex items-center justify-center">
                                <div className="bg-gray-200 rounded-full cursor-pointer h-36 w-36 flex items-center justify-center" onClick={() => fileInputRef.current.click()}>
                                    {image ? (
                                        <img
                                            src={URL.createObjectURL(image)}
                                            className="transition duration-200 ease-in-out hover:scale-110 hover:opacity-80 hover:cursor-pointer w-36 h-36 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-center  flex items-center">
                                            <FaUpload className="mr-2" size={20}/> Subir Imagen
                                        </span>
                                    )}
                                    <input
                                        type="file"
                                        onChange={ImageUpload}
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="mt-1 ">
                            <StartGenerate/>
                        </div>
                        <div className="flex items-center justify-center">
                            <Button
                                type="submit"
                                className="text-center bg-blue-500 text-white py-2 px-7 rounded-full"
                            >
                                Enviar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>  
        </div>
    );
}

export default ProductRating;
