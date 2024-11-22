// frontend/easy-chatbot-main/pages/random-info.tsx
import React from 'react';
import ChatbotBubble from '@/components/ChatbotBubble';

const RandomInfoPage = () => {
  return (
    <div className="relative min-h-screen bg-white p-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-gray-800 drop-shadow-lg animate-fade-in">Bienvenue sur la page d'informations aléatoires</h1>
        <p className="text-2xl text-gray-600 mt-4 animate-fade-in">Découvrez des faits étonnants sur les entreprises françaises !</p>
      </header>

      <main className="max-w-4xl mx-auto bg-gray-100 p-8 rounded-lg shadow-lg">
        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-in">Faits étonnants</h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700 animate-fade-in">
            <li>Did you know that L'Oréal is the world's largest cosmetics company? Founded in 1909, it has a presence in over 150 countries.</li>
            <li>Renault, founded in 1899, is one of the oldest automobile manufacturers in the world and has a strong presence in the electric vehicle market.</li>
            <li>Airbus, headquartered in Toulouse, is a leading aircraft manufacturer and a major competitor to Boeing.</li>
            <li>Danone, founded in 1919, is a multinational food-products corporation known for its dairy products, bottled water, and baby food.</li>
            <li>BNP Paribas, established in 2000, is one of the largest banks in the world and has a significant presence in Europe, the Americas, and Asia.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-in">Trivia aléatoire</h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700 animate-fade-in">
            <li>Le plus court conflit de l'histoire a eu lieu entre la Grande-Bretagne et Zanzibar le 27 août 1896. Zanzibar s'est rendu après 38 minutes.</li>
            <li>Un éclair contient suffisamment d'énergie pour griller 100 000 tranches de pain.</li>
            <li>Il existe plus de combinaisons possibles dans une partie d'échecs qu'il n'y a d'atomes dans l'univers connu.</li>
            <li>La Tour Eiffel peut être plus haute de 15 cm en été en raison de l'expansion du fer sous la chaleur.</li>
            <li>Les excréments de wombat sont en forme de cube.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-in">Trivia intéressant</h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700 animate-fade-in">
            <li>Les humains partagent 60% de leur ADN avec les bananes.</li>
            <li>Il y a plus de bibliothèques publiques aux États-Unis que de restaurants McDonald's.</li>
            <li>L'inventeur de la boîte de Pringles est maintenant enterré dans l'une d'elles.</li>
            <li>L'animal national de l'Écosse est la licorne.</li>
            <li>L'Université d'Oxford est plus ancienne que l'Empire aztèque.</li>
          </ul>
        </section>
      </main>

      <ChatbotBubble />
    </div>
  );
};

export default RandomInfoPage;