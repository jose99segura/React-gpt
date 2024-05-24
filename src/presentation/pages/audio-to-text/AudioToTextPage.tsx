
import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from "../../components";
import { audioToTextUseCase } from "../../../core/use-cases";

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string, audioFile: File ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false }] );

    // TODO: UseCase
    const resp = await audioToTextUseCase( audioFile, text );
    setIsLoading(false);

    if( !resp ) return;

    const gptMessage = `
## Transcripción de audio:
__Duración:__ ${ Math.round(resp.duration) }
## El texto es:
${ resp.text }
`

    setMessages( (prev) => [
      ...prev, 
      { text: gptMessage, isGpt: true }
     ]);

     for( const segment of resp.segments ) {
      const segmentMessage = `
__De ${ Math.round(segment.start) } a ${ Math.round(segment.end) } segundos:__
${ segment.text }
`
      setMessages( (prev) => [
        ...prev, 
        { text: segmentMessage, isGpt: true }
       ]);
     }

  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text="Hola, puedes mandar tu audio en español y te doy los subtitulos." />

          { 
            messages.map( (message, index) => (

              message.isGpt 
              ? (
                // Mensaje de OpenAI
                <GptMessage key={index} text={ message.text } />
              )
              : (
                // Mensaje de usuario
                <MyMessage key={index} text={message.text || 'Transcribe el audio'} />
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
      <TextMessageBoxFile
        onSendMessage={ handlePost }
        placeholder="Escribe un mensaje..."
        disableCorrections
        accept="audio/*"
      />

    </div>
  )
}
