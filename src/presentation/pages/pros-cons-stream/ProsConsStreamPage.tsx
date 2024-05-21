import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConsStreamUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    // useCase de pros y cons stream
    const reader = await prosConsStreamUseCase( text );
    setIsLoading(false);

    if( !reader ) return;

    // Generar el ultimo mensaje

    const decoder = new TextDecoder()
    let message = '';

    setMessages( (messages) => [ ...messages, { text: message, isGpt: true } ] );

    // Leer el stream mientras haya datos disponibles
    while( true ) {
      const { value, done } = await reader.read();

      // Si done es true, se terminó de leer el stream
      if( done ) break;

      const decodedChunk = decoder.decode( value, { stream: true } );
      message += decodedChunk;

      //Actualizar el mensaje, no incluir otro
      setMessages( (messages) => {
        const newMessages = [...messages];
        newMessages[ newMessages.length - 1 ].text = message;
        return newMessages;
      });
    }

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="¿Qué deseas comparar hoy?" />

          { 
            messages.map( (message, index) => (

              message.isGpt 
              ? (
                // Mensaje de OpenAI
                <GptMessage key={index} text={ message.text } />
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
