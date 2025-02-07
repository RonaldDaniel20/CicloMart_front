import React, { useState } from 'react'
import ProductForm from '../components/Publish/ProductForm'
import ProductSelection from '../components/Publish/ProductSelection'
import Verification from '../components/Publish/Verification'

const Publish = () => {
  const [step, setStep] = useState('selection')
  const [productType, setProductType] = useState('')
  const [productData, setProductData] = useState(null)

  const handleSelect = (type) => {
    setProductType(type)
    setStep('form')
  }

  const handleFormSubmit = (data) => {
    setProductData(data)
    if (productType === 'bicycle') {
      setStep('verification')
    } else {
      setStep('complete')
      console.log('Product Data:', data)
    }
  }

  const handleVerification = (code) => {
    console.log('Verification Code:', code)
    setStep('complete')
  }

  return (
    <div>
      {step === 'selection' && <ProductSelection onSelect={handleSelect} />}
      {step === 'form' && (
        <ProductForm type={productType} onSubmit={handleFormSubmit} />
      )}
      {step === 'verification' && (
        <Verification onVerify={handleVerification} />
      )}
      {step === 'complete' && (
        <div className="flex flex-col w-full items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold mb-4">Publicación Completada!</h1>
          <p className="text-gray-700">
            Tu {productType} {productData?.title} ha sido publicado
            correctamente.
          </p>
        </div>
      )}
    </div>
  )
}

export default Publish
