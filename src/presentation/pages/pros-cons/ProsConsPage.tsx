import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { prosConsUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    // TODO: UseCase
    const { ok, content } = await prosConsUseCase(text);

    setIsLoading(false);

    if( !ok ) return;

    setMessages( (prev) => [...prev, { text: content, isGpt: true }] );

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="Escribe lo que quieras y te diré los pros y contras de ese tema." />

          { 
            messages.map( (message, index) => (

              message.isGpt 
              ? (
                // Mensaje de OpenAI
                <GptMessage key={index} text={message.text} />
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
