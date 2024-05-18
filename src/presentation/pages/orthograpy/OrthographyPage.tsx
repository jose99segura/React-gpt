import { useState } from "react"
import { GptMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"

interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {

  // Estados
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState([]);


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="Hola, puedes escribir tu texto en español, y te ayudo a corregir la ortografía." />
            
          {/* Mensaje de usuario */}
          <MyMessage text="Hola Mundo"/>

          {/* Loader */}
          <TypingLoader className="fade-in" />
          
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
