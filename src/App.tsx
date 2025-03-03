import Invitation from "./Invitation";
import invitePhoto from "./assets/1.png"
function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Invitation
        image={invitePhoto}
        title="Chá Revelação!"
        description="É com tremenda alegria que convidamos vocês para estarem conosco nesta descoberta!"
        date="30 de Março de 2025"
        time="13h30"
        location="Estrada da Boiada, 1471 - Jardim Primavera, Vinhedo, SP"
      />
    </div>
  );
}

export default App;
