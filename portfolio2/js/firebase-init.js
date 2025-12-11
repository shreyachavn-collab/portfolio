// Firebase initialization (uses window.firebaseConfig set by firebase-config.js)
// Load Firebase SDK from CDN and initialize if config is available

(async function(){
  try {
    // Check if config is available globally (loaded from firebase-config.js)
    const firebaseConfig = window.firebaseConfig;
    
    if (!firebaseConfig || firebaseConfig.apiKey === 'REPLACE_ME') {
      console.warn('Firebase config not available or placeholder. Skipping Firebase init.');
      window.dispatchEvent(new Event('firebaseReady'));
      return;
    }

    console.log('Firebase config found:', firebaseConfig.projectId);

    // Load Firebase SDK from CDN (v9.22.2 - compat version for compatibility)
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
    script.onload = () => {
      console.log('Firebase SDK loaded');
      // Load Firestore compat
      const firestoreScript = document.createElement('script');
      firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js';
      firestoreScript.onload = () => {
        // Initialize Firebase
        try {
          const firebase = window.firebase;
          firebase.initializeApp(firebaseConfig);
          const db = firebase.firestore();
          console.log('Firestore initialized for project:', firebaseConfig.projectId);

          window.firebaseService = {
            async getPortfolio() {
              try {
                console.log('Attempting to get portfolio from Firestore...');
                const doc = await db.collection('portfolio').doc('main').get();
                console.log('Got Firestore response:', doc.exists ? 'exists' : 'does not exist');
                if (doc.exists) return doc.data().data;
                return null;
              } catch (e) {
                console.error('Firebase get error', e);
                return null;
              }
            },
            async setPortfolio(data) {
              try {
                console.log('Attempting to save portfolio to Firestore...');
                await db.collection('portfolio').doc('main').set({ data });
                console.log('Portfolio saved to Firestore successfully');
                return true;
              } catch (e) {
                console.error('Firebase set error:', e.code, e.message);
                return false;
              }
            }
          };

          console.info('Firebase initialized and service available as window.firebaseService');
          window.dispatchEvent(new Event('firebaseReady'));
        } catch (err) {
          console.error('Firebase initialization failed:', err);
          window.dispatchEvent(new Event('firebaseReady'));
        }
      };
      firestoreScript.onerror = () => {
        console.error('Failed to load Firestore SDK');
        window.dispatchEvent(new Event('firebaseReady'));
      };
      document.head.appendChild(firestoreScript);
    };
    script.onerror = () => {
      console.error('Failed to load Firebase SDK');
      window.dispatchEvent(new Event('firebaseReady'));
    };
    document.head.appendChild(script);

  } catch (err) {
    console.info('Firebase initialization error:', err && err.message ? err.message : err);
    window.dispatchEvent(new Event('firebaseReady'));
  }
})();
