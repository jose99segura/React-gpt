import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage } from "../../components";
import { imageGenerationUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageGenerationPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    const imageInfo = await imageGenerationUseCase( text );
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
                <GptMessageImage 
                  key={index} 
                  text={message.text}
                  imageUrl={message.info?.imageUrl!}
                  alt={message.info?.alt!} 
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
  )
}
