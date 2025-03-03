import React, { useState } from "react";
import { motion } from "framer-motion"; // Para animação do "Obrigado"

interface InvitationProps {
  image: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzVnOFEsU-2SIWL1ZjZ8AU_K0_or3u1D7p1uutGATFO3_Xly0q67bTgl3VQJxWmrQ2D/exec";

const Invitation: React.FC<InvitationProps> = ({ image, title, description, date, time, location }) => {
  const [confirmed, setConfirmed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [guests, setGuests] = useState([{ name: "" }]);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Adiciona um novo campo de nome
  const addGuest = () => {
    setGuests([...guests, { name: "" }]);
  };

  // Atualiza os valores dos campos de nome
  const updateGuest = (index: number, value: string) => {
    const updatedGuests = [...guests];
    updatedGuests[index].name = value;
    setGuests(updatedGuests);
  };

  // Envia os dados para o Google Sheets
  const handleConfirm = async () => {
    if (!phone.trim() || !guests.some((guest) => guest.name.trim() !== "")) {
      alert("Preencha pelo menos um nome e o telefone antes de enviar!");
      return;
    }

    setIsSubmitting(true);
    const data = {
      guests: guests.filter(guest => guest.name.trim() !== ""),
      phone,
    };

    try {
      const response = await fetch(GOOGLE_SHEETS_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // 🔹 Evita bloqueios de CORS
      });

      console.log("Tentativa de envio concluída.",response);
      setIsFormOpen(false);
      setConfirmed(true);
      setShowThankYou(true);

      setTimeout(() => setShowThankYou(false), 4000);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com o Google Sheets!");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto border border-gray-300">
      {/* Imagem do convite com animação de piscar e clique para expandir */}
      <img
        src={image}
        alt="Convite"
        className={`w-full md:w-1/2 object-cover cursor-pointer transition-opacity hover:opacity-80 ${
          !isModalOpen ? "animate-pulse" : ""
        }`}
        onClick={() => setIsModalOpen(true)} // 🔹 Agora a imagem expande corretamente
      />

      {/* Conteúdo do convite */}
      <div className="p-6 flex flex-col justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>

        {/* Informações */}
        <div className="mt-4 space-y-2">
          <p className="text-gray-700">
            📅 <strong>Data:</strong> {date}
          </p>
          <p className="text-gray-700">
            ⏰ <strong>Hora:</strong> {time}
          </p>
          <p className="text-gray-700">
            📍 <strong>Local:</strong> {location}
          </p>
        </div>

        {/* Botão de confirmação */}
        <button
          onClick={() => setIsFormOpen(true)}
          className={`mt-4 px-4 py-2 text-white font-semibold rounded-md transition-all ${
            confirmed ? "bg-green-500 cursor-default" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={confirmed}
        >
          {confirmed ? "Presença Confirmada ✅" : "Confirmar Presença"}
        </button>
      </div>

      {/* Modal de imagem ampliada (corrigido) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)} // 🔹 Fechar ao clicar fora
        >
          <img
            src={image}
            alt="Convite Ampliado"
            className="max-w-full max-h-full rounded-lg shadow-lg cursor-pointer"
          />
        </div>
      )}

      {/* Modal de preenchimento de informações */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirme sua Presença</h2>

            {/* Campos de Nome */}
            {guests.map((guest, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Nome"
                  value={guest.name}
                  onChange={(e) => updateGuest(index, e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                />
                {index === guests.length - 1 && (
                  <button
                    onClick={addGuest}
                    className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
                  >
                    +
                  </button>
                )}
              </div>
            ))}

            {/* Campo único de Telefone */}
            <input
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mt-2"
            />

            {/* Botão de Enviar */}
            <button
              onClick={handleConfirm}
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      )}

      {/* Animação de "Obrigado" */}
      {showThankYou && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white text-xl font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          🎉 Obrigado por confirmar! Nos vemos em breve! 🎊
        </motion.div>
      )}
    </div>
  );
};

export default Invitation;
