// -> Utilidades
import { twMerge } from 'tailwind-merge'

/* Permite mostrar información de el modal de seguridad y de preferencias*/
const OptionSelector = ({ text, children, className, onClick = () => {} }) => {
  return (
    <div
      className={twMerge(
        'border-b border-lgray flex flex-row items-center hover:border-b hover:border-t hover:border-black hover:cursor-pointer hover:bg-lgray hover:animate-pulse',
        className
      )}
      onClick={onClick}
    >
      {children}
      <div className="h-full w-full flex flex-col justify-center items-center pl-8 md:pl-0">
        <b className="text-2xl">{text}</b>
      </div>
    </div>
  )
}

export default OptionSelector
