

import { useEffect, useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { createThreadUseCase, postQuestionUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AssistantPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<string>();

  // Obtener el thread y si no existe, crearlo
  useEffect(() => {
    const threadId = localStorage.getItem('threadId');

    if( threadId ) {
      setThreadId(threadId);
    } else {
      // Crear el thread llamando al caso de uso
      createThreadUseCase()
        .then( (id) => {
          setThreadId(id);
          localStorage.setItem('threadId', id);
        })
    }
  }, []);

  useEffect(() => {
    if( threadId ) {
      // Obtener mensajes del hilo
      setMessages( (prev) => [...prev, { text: `Número de thread ${ threadId }`, isGpt: true }]);
    }
  }, [threadId])
  
  


  const handlePost = async( text: string ) => {

    if( !threadId ) {
      console.error('No hay threadId');
      return;
    }

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    const replies = await postQuestionUseCase( threadId, text );

    // limpiar mensajes
    setMessages([]);

    setIsLoading(false);

    for (const reply of replies) {
      for (const message of reply.content) {
        setMessages( (prev) => [
          ...prev, 
          { text: message, isGpt: (reply.role === 'assistant'), info: reply }
        ] );
      }
    }

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="Hola, soy Sam, ¿En qué puedo ayudarte?" />

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
