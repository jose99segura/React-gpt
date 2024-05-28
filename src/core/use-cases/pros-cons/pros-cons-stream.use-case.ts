

export const prosConsStreamUseCase = async( prompt: string ) => {

    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt }),
            //TODO: abortSignal
        });    

        if( !resp.ok ) throw new Error('No se pudo realizar los pros y cons');

        // getReader para leer el stream
        const reader = resp.body?.getReader();

        if( !reader ) throw new Error('No se pudo leer el stream');

        return reader;

        // Decodificador de texto para leer el stream en texto plano
        // const decoder = new TextDecoder();

        // let text = '';

        // // Leer el stream mientras haya datos disponibles
        // while( true ) {
        //     const { value, done } = await reader.read();

        //     // Si done es true, se terminó de leer el stream
        //     if( done ) break;

        //     const decodedChunk = decoder.decode( value, { stream: true } );
        //     text += decodedChunk;
        //     console.log(decodedChunk);
            
        // }

       
        
    } catch (error) {
        console.log(error);  
        return null;  
    }

}