
import { useState } from "react"
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GptMessageAudio } from "../../components";
import { textToAudioUseCase } from "../../../core/use-cases";

const displaimer = `## ¿Qué audio quieres generar hoy?
* Todo el audio generado es por AI.
`;

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: "audio";
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {

  // Estados
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async( text: string, selectedVoice: string ) => {

    setIsLoading(true);
    setMessages( (prev) => [...prev, { text, isGpt: false, type: 'text' }] );

    const { ok, message, audioUrl } = await textToAudioUseCase( text, selectedVoice );

    setIsLoading(false);

    if( !ok ) return;

    setMessages( (prev) => [...prev, 
      { text: message, isGpt: true, audio: audioUrl!, type: 'audio' }
    ] );



  }


  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">

          {/* Mensaje de GPT */}
          <GptMessage text={ displaimer } />

          { 
            messages.map( (message, index) => (

              message.isGpt 
              ? (

                message.type === 'audio' ? (
                  // Mensaje de OpenAI
                  <GptMessageAudio 
                    key={index} 
                    text={ message.text } 
                    audio = { message.audio }
                  />
                ) : (
                  // Mensaje de usuario
                  <MyMessage key={index} text={message.text} />
                )
                
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
      <TextMessageBoxSelect
        onSendMessage={ handlePost }
        placeholder="Escribe un mensaje..."
        options={ voices }
      />

    </div>
  )
}
