
import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageSelectableImage } from "../../components";
import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: 'Imagen base',
      info: {
        imageUrl: 'http://localhost:3000/gpt/image-generation/1716800434892.png',
        alt: 'Imagen base'
      }
    }
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  })

  const handleVariation = async() => {
    setIsLoading(true);
    const resp = await imageVariationUseCase( originalImageAndMask.original! );
    setIsLoading(false);

    if ( !resp )return;

    setMessages( (prev) => [
      ...prev,
      {
        text: 'Variación',
        isGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt
        }
      }
    ])

  }

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase( text, original, mask );
    setIsLoading(false);

    if( !imageInfo) {
      return setMessages( (prev) => [...prev, { text: "Error al generar la imagen", isGpt: true }] );
    }

    setMessages( (prev) => [
      ...prev, 
      { 
        text: text, 
        isGpt: true, 
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt
        }
      }
    ]);


  }


  return (
    <>
    {
      originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img 
            className="border rounded-xl w-36 h-36 object-contain"
            src={ originalImageAndMask.mask ?? originalImageAndMask.original } 
            alt="Imagen original"
          />
          <button onClick={ handleVariation } className="btn-primary mt-2">Generar variación</button>
        </div>
      )
    }
     <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y generaré una imagen a partir del texto." />

          { 
            messages.map( (message, index) => (

              message.isGpt 
              ? (
                // Mensaje de OpenAI
                // GptMessageImage
                <GptMessageSelectableImage
                  key={index} 
                  text={message.text}
                  imageUrl={message.info?.imageUrl!}
                  alt={message.info?.alt!} 
                  onImageSelected={ (maskImageUrl) =>  setOriginalImageAndMask({
                    original: message.info?.imageUrl!,
                    mask: maskImageUrl
                  }) }
                />
              )
              : (
                // Mensaje de usuario
                <MyMessage key={index} text={message.text} />
              )

            ))
          }

          {/* Loader */}
          {
            isLoading && (
              <div className="col-start-1 col-end-12 fade-in">
                <TypingLoader/>
              </div>
            )
          }
         
          
        </div>
      </div>

      {/* Input de texto */}
      <TextMessageBox
        onSendMessage={ handlePost }
        placeholder="Escribe un mensaje..."
        disableCorrections
      />

    </div>
    </>
   
  )
}
