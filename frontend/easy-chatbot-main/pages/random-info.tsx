// frontend/easy-chatbot-main/pages/random-info.tsx
import React from 'react';
import ChatbotBubble from '@/components/ChatbotBubble';

const RandomInfoPage = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-8">
      <header className="text-center mb-12">
        <h1 className="text-6xl font-extrabold text-white drop-shadow-lg animate-fade-in">Bienvenue sur la page d'informations aléatoires</h1>
        <p className="text-2xl text-white mt-4 animate-fade-in">Découvrez des faits étonnants sur les entreprises françaises !</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-12">
        <article className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg animate-slide-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Faits étonnants</h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700">
            <li>L'Oréal est la plus grande entreprise de cosmétiques au monde. Fondée en 1909, elle est présente dans plus de 150 pays.</li>
            <li>Renault, fondée en 1899, est l'un des plus anciens constructeurs automobiles au monde et a une forte présence sur le marché des véhicules électriques.</li>
            <li>Airbus, dont le siège est à Toulouse, est un leader de la fabrication d'avions et un concurrent majeur de Boeing.</li>
            <li>Danone, fondée en 1919, est une multinationale de produits alimentaires connue pour ses produits laitiers, ses eaux en bouteille et ses aliments pour bébés.</li>
            <li>BNP Paribas, créée en 2000, est l'une des plus grandes banques du monde et a une présence significative en Europe, en Amérique et en Asie.</li>
          </ul>
        </article>

        <article className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg animate-slide-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Trivia aléatoire</h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700">
            <li>Le plus court conflit de l'histoire a eu lieu entre la Grande-Bretagne et Zanzibar le 27 août 1896. Zanzibar s'est rendu après 38 minutes.</li>
            <li>Un éclair contient suffisamment d'énergie pour griller 100 000 tranches de pain.</li>
            <li>Il existe plus de combinaisons possibles dans une partie d'échecs qu'il n'y a d'atomes dans l'univers connu.</li>
            <li>La Tour Eiffel peut être plus haute de 15 cm en été en raison de l'expansion du fer sous la chaleur.</li>
            <li>Les excréments de wombat sont en forme de cube.</li>
          </ul>
        </article>

        <article className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg animate-slide-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Trivia intéressant</h2>
          <ul className="list-disc list-inside space-y-4 text-gray-700">
            <li>Les humains partagent 60% de leur ADN avec les bananes.</li>
            <li>Il y a plus de bibliothèques publiques aux États-Unis que de restaurants McDonald's.</li>
            <li>L'inventeur de la boîte de Pringles est maintenant enterré dans l'une d'elles.</li>
            <li>L'animal national de l'Écosse est la licorne.</li>
            <li>L'Université d'Oxford est plus ancienne que l'Empire aztèque.</li>
          </ul>
        </article>
      </main>

      <ChatbotBubble />
    </div>
  );
};

export default RandomInfoPage;