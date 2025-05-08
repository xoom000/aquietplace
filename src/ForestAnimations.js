// ForestAnimations.js - Add this to your project
import { useEffect } from 'react';

const ForestAnimations = () => {
  // Create falling leaves
  useEffect(() => {
    const createLeaves = () => {
      const leavesContainer = document.createElement('div');
      leavesContainer.className = 'falling-leaves';
      document.body.appendChild(leavesContainer);
      
      // Create leaves - reduced number for smaller screens
      const numLeaves = window.innerWidth < 480 ? 5 : (window.innerWidth < 768 ? 10 : 20);
      
      for (let i = 0; i < numLeaves; i++) {
        const leaf = document.createElement('div');
        
        // Randomly select leaf type
        const leafType = Math.floor(Math.random() * 3) + 1;
        leaf.className = `leaf leaf${leafType}`;
        
        // Random position, size, and animation duration
        const leftPos = Math.random() * 100;
        const size = Math.random() * 10 + 10;
        const duration = Math.random() * 10 + 15;
        const delay = Math.random() * 15;
        
        leaf.style.left = `${leftPos}vw`;
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;
        
        leavesContainer.appendChild(leaf);
      }
    };
    
    // Create fireflies
    const createFireflies = () => {
      const firefliesContainer = document.createElement('div');
      firefliesContainer.className = 'fireflies';
      document.body.appendChild(firefliesContainer);
      
      // Create fireflies - reduced number for smaller screens
      const numFireflies = window.innerWidth < 480 ? 8 : (window.innerWidth < 768 ? 15 : 30);
      
      for (let i = 0; i < numFireflies; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';
        
        // Random position and animation
        const leftPos = Math.random() * 100;
        const topPos = Math.random() * 100;
        const size = Math.random() * 3 + 2;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 15;
        
        firefly.style.left = `${leftPos}vw`;
        firefly.style.top = `${topPos}vh`;
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        firefly.style.animationDuration = `${duration}s`;
        firefly.style.animationDelay = `${delay}s`;
        
        // Create firefly movement animation
        const keyframes = `
          @keyframes firefly-${i} {
            0% { transform: translate(0, 0); }
            25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
            50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
            75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); }
            100% { transform: translate(0, 0); }
          }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = keyframes;
        document.head.appendChild(styleSheet);
        
        firefly.style.animation = `firefly ${duration}s linear infinite, firefly-${i} ${duration * 2}s ease-in-out infinite`;
        
        firefliesContainer.appendChild(firefly);
      }
    };
    
    // Create forest animal silhouettes
    const createForestAnimals = () => {
      const animalsContainer = document.createElement('div');
      animalsContainer.className = 'animals';
      document.body.appendChild(animalsContainer);
      
      // Add fox
      const fox = document.createElement('div');
      fox.className = 'fox';
      animalsContainer.appendChild(fox);
      
      // Add owl
      const owl = document.createElement('div');
      owl.className = 'owl';
      animalsContainer.appendChild(owl);
      
      // Add rabbit
      const rabbit = document.createElement('div');
      rabbit.className = 'rabbit';
      animalsContainer.appendChild(rabbit);
    };
    
    // Add ambient light
    const createAmbientLight = () => {
      const ambientLight = document.createElement('div');
      ambientLight.className = 'ambient-light';
      document.body.appendChild(ambientLight);
    };
    
    // Initialize all animations
    createLeaves();
    createFireflies();
    createForestAnimals();
    createAmbientLight();
    
    // Cleanup function
    return () => {
      const leaves = document.querySelector('.falling-leaves');
      const fireflies = document.querySelector('.fireflies');
      const animals = document.querySelector('.animals');
      const ambientLight = document.querySelector('.ambient-light');
      
      if (leaves) document.body.removeChild(leaves);
      if (fireflies) document.body.removeChild(fireflies);
      if (animals) document.body.removeChild(animals);
      if (ambientLight) document.body.removeChild(ambientLight);
    };
  }, []);
  
  return null; // This component doesn't render anything
};

export default ForestAnimations;