import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"

interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {

  // Estados
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


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
          <div className="col-start-1 col-end-12 fade-in">
            <TypingLoader/>
          </div>
         
          
        </div>
      </div>

      {/* Input de texto */}
      <TextMessageBox
        onSendMessage={ (message) => console.log(message) }
        placeholder="Escribe un mensaje..."
        disableCorrections
      />

    </div>
  )
}
