import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs, getDoc, deleteDoc} from 'firebase/firestore'
import { db }  from '../fireBaseConfig/firebase'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Show = () => {
    // CONFIGURACION DE HOOKS
    const [products, setproducts] = useState( [] )
    // REFERENCIA A LA DB DE FIRESTORE
    const productCollection = collection(db, 'products')
    // FUNCION PARA MOSTAR TODOS LOS PRODUCTOS
    const getProductsCollection = async () => {
        const data = await getDocs(productCollection)
        setproducts(
            data.docs.map((doc) => ({...doc.data(), id:doc.id}))
        )
        console.log(products);
    }
    // FUNCION PARA ELIMINAR UN PRODUCTO
    // const deleteProduct = async (id) => {
    //     const productDoc = doc(db, 'products', id)
    //     await deleteDoc(deleteProduct)
    //     getProductsCollection()
    // }

    //USO DE USEEFFECT
    useEffect(() => {
        getProductsCollection()
        // eslint-disable-next-LINE
    }, [])
    return (
        // <>
        // <div>

        // </div>
        // </> 
        <div>Show</div>
    )
}

export default Show;
