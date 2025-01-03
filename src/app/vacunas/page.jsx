import VacunasLista from '@/components/Vacunas/Lista'
import Modal from '@/components/Modal'
import { Plus } from 'lucide-react'
import { Suspense } from 'react'
import VacunaInsertar from '@/components/Vacunas/Insertar'


export default function page() {
    return (
        <div className='container mx-auto px-4 py-10 flex flex-col'>
            <div className='flex justify-between px-4 pb-2 mb-8 border-b-4 border-blue-100'>
                <h1 className='text-4xl text-blue-400 font-bold'>VACUNAS</h1>

                <Modal
                    icono={<Plus />}
                    className={'place-self-end p-1 rounded-full border border-green-500 text-green-700 bg-green-200 hover:bg-green-500 hover:text-white hover:cursor-pointer'}>
                    <VacunaInsertar />
                </Modal>
            </div>


            <Suspense fallback={
                <div className="text-2xl text-blue-200 font-bold animate-pulse">
                    Obteniendo vacunas ...
                </div>
            }>
                <VacunasLista />
            </Suspense>

        </div>
    )
}
