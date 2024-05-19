import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"

interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    // TODO: UseCase

    setIsLoading(false);

    // TODO: Añadir mensaje de isGPT en true

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo a corregir la ortografía." />

          { 
            messages.map( (message, index) => (

              message.isGpt 
              ? (
                // Mensaje de OpenAI
                <GptMessage key={index} text="Esto es OpenAI" />
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

       {/* <TextMessageBoxFile
        onSendMessage={ handlePost }
        placeholder="Escribe un mensaje..."
        /> */}
      
      {/* <TextMessageBoxSelect 
        onSendMessage={ console.log }
        options= { [ { id: "1", text: 'Hola' }, { id: "2", text: 'Mundo' } ] }
      /> */}

    </div>
  )
}
