// frontend/easy-chatbot-main/pages/random-info.tsx
import React from 'react';
import ChatbotBubble from '@/components/ChatbotBubble';

const RandomInfoPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Random Info Page</h1>
      <p className="mt-4">Here is some random information...</p>
      
      <section className="mt-4">
        <h2 className="text-xl font-semibold">Did You Know?</h2>
        <ul className="list-disc list-inside mt-2">
          <li>Honey never spoils. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still edible.</li>
          <li>Bananas are berries, but strawberries aren't.</li>
          <li>There are more stars in the universe than grains of sand on all the Earth's beaches.</li>
          <li>An octopus has three hearts and blue blood.</li>
          <li>A day on Venus is longer than a year on Venus.</li>
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Random Facts</h2>
        <ul className="list-disc list-inside mt-2">
          <li>The shortest war in history was between Britain and Zanzibar on August 27, 1896. Zanzibar surrendered after 38 minutes.</li>
          <li>A bolt of lightning contains enough energy to toast 100,000 slices of bread.</li>
          <li>There are more possible iterations of a game of chess than there are atoms in the known universe.</li>
          <li>The Eiffel Tower can be 15 cm taller during the summer due to the expansion of iron in the heat.</li>
          <li>Wombat poop is cube-shaped.</li>
        </ul>
      </section>

      <section className="mt-4">
        <h2 className="text-xl font-semibold">Interesting Trivia</h2>
        <ul className="list-disc list-inside mt-2">
          <li>Humans share 60% of their DNA with bananas.</li>
          <li>There are more public libraries in the United States than McDonald's restaurants.</li>
          <li>The inventor of the Pringles can is now buried in one.</li>
          <li>Scotland's national animal is the unicorn.</li>
          <li>Oxford University is older than the Aztec Empire.</li>
        </ul>
      </section>

      <ChatbotBubble />
    </div>
  );
};

export default RandomInfoPage;