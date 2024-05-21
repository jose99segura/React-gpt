import { ProsConsResponse } from "../../interfaces";


export const prosConsUseCase = async( prompt: string ) => {

    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });    

        if( !resp.ok ) throw new Error('No se pudo realizar los pros y cons');

        const data = await resp.json() as ProsConsResponse;

        return {
            ok: true,
            ...data
        }
        
    } catch (error) {
        return {
            ok: false,   
            content: 'No se pudo realizar los pros y cons'
        }     
    }

}