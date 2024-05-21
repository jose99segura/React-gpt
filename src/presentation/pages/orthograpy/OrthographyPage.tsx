import { useState } from "react"
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from "../../components"
import { orthographyUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
  }
}

export const OrthographyPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    // Llamar a la función de use-case
    const { ok, errors, message, userScore } = await orthographyUseCase(text);
    
    if( !ok ) {
      setMessages( (prev) => [...prev, { text: 'No se pudo realizar la correción', isGpt: true}] );
    } else{
      setMessages( (prev) => [...prev, { 
        text: message , 
        isGpt: true,  
        info: { userScore, errors,  message }
      }] );
    }
    
    // IsLoading a false
    setIsLoading(false);

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
                <GptOrthographyMessage 
                  key={index}  
                  errors={ message.info!.errors }
                  message= { message.info!.message }
                  userScore={ message.info!.userScore }
                  // { ...message.info }
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
